'use strict';

/**
 * `shop-scope` policy
 *
 * Enforces multi-tenant data isolation by filtering queries based on the shop
 * owned by the authenticated user.
 *
 * Platform admins bypass this filter and can access all shops.
 */

module.exports = async (policyContext, config, { strapi }) => {
  const user = policyContext.state.user;

  // Allow unauthenticated public access (for storefront read-only queries)
  // Public queries should still filter by subdomain in the controller
  if (!user) {
    return true;
  }

  // Platform admins can access all data
  if (user.role && user.role.type === 'platform_admin') {
    return true;
  }

  // Get the user's shop
  const userShops = await strapi.entityService.findMany('api::shop.shop', {
    filters: {
      owner: {
        id: user.id,
      },
    },
    fields: ['id'],
  });

  // User must have a shop
  if (!userShops || userShops.length === 0) {
    strapi.log.warn(`User ${user.id} tried to access data but has no associated shop`);
    return false;
  }

  const userShop = userShops[0];

  // For create operations, automatically set the shop
  if (policyContext.request.method === 'POST') {
    if (policyContext.request.body && policyContext.request.body.data) {
      policyContext.request.body.data.shop = userShop.id;
    }
  }

  // For read operations, filter by user's shop
  if (policyContext.request.method === 'GET') {
    // Ensure the query filters by the user's shop
    if (!policyContext.request.query.filters) {
      policyContext.request.query.filters = {};
    }

    // Only apply shop filter if not already present (to allow more specific filtering)
    if (!policyContext.request.query.filters.shop) {
      policyContext.request.query.filters.shop = {
        id: {
          $eq: userShop.id,
        },
      };
    }
  }

  // For update/delete operations, verify the entity belongs to user's shop
  if (policyContext.request.method === 'PUT' || policyContext.request.method === 'DELETE') {
    const entityId = policyContext.request.params.id;

    if (entityId) {
      // Determine the content type from the route
      const contentType = policyContext.request.route.info.apiName;

      // Skip shop-scope check for the shop entity itself
      if (contentType === 'shop') {
        // Users can only update their own shop
        // Normalize both IDs to numbers for comparison
        const normalizedEntityId = typeof entityId === 'string' ? parseInt(entityId, 10) : entityId;
        const normalizedShopId = typeof userShop.id === 'string' ? parseInt(userShop.id, 10) : userShop.id;

        if (normalizedEntityId !== normalizedShopId) {
          strapi.log.warn(`User ${user.id} tried to modify shop ${entityId} but owns shop ${userShop.id}`);
          return false;
        }
        return true;
      }

      // For other entities, verify they belong to the user's shop
      try {
        const entity = await strapi.entityService.findOne(
          `api::${contentType}.${contentType}`,
          entityId,
          {
            populate: ['shop'],
          }
        );

        if (!entity || !entity.shop) {
          return false;
        }

        const entityShopId = typeof entity.shop === 'object' ? entity.shop.id : entity.shop;

        // Normalize both IDs to numbers for comparison
        const normalizedEntityShopId = typeof entityShopId === 'string' ? parseInt(entityShopId, 10) : entityShopId;
        const normalizedUserShopId = typeof userShop.id === 'string' ? parseInt(userShop.id, 10) : userShop.id;

        if (normalizedEntityShopId !== normalizedUserShopId) {
          strapi.log.warn(
            `User ${user.id} tried to access ${contentType} ${entityId} belonging to shop ${entityShopId}`
          );
          return false;
        }
      } catch (error) {
        strapi.log.error('Error in shop-scope policy:', error);
        return false;
      }
    }
  }

  return true;
};
