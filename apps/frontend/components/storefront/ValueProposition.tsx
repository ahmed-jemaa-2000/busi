import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export default function ValueProposition() {
  const benefits = [
    'Carefully curated collection',
    'Latest fashion trends',
    'Competitive pricing',
    'Secure payment options',
    'Fast & reliable delivery',
    'Customer satisfaction guaranteed'
  ];

  return (
    <Section background="white" spacing="lg">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 animate-fade-in">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Shop With Us?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're committed to bringing you the best shopping experience with quality products, excellent service, and unbeatable value.
              </p>
            </div>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <p className="text-sm text-gray-500 italic">
                Join thousands of satisfied customers who trust us for their fashion needs.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
