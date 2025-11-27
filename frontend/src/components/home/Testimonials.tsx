const Testimonials = () => {
  const reviews = [
    {
      name: "Alex Johnson",
      role: "Developer",
      text: "This app brings back the nostalgia of early internet chat but with modern speed. Absolutely love the design!",
    },
    {
      name: "Sarah Smith",
      role: "Designer",
      text: "Finally, a chat app that doesn't look like every other corporate tool. The design is refreshing and clean.",
    },
    {
      name: "Mike Brown",
      role: "Gamer",
      text: "Fast, secure, and looks cool. My friends and I switched to this for our gaming sessions.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-violet-50 border-b-4 border-gray-900">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-tertiary text-gray-900 uppercase tracking-wider">
            Loved by the Community
          </h2>
          <p className="text-gray-900 font-mono text-lg font-bold">
            See what our users are saying about their experience with ChatApp.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-8 border-4 border-gray-900 shadow-background hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-6 border-b-4 border-gray-900 pb-4">
                <div className="h-10 w-10 bg-violet-500 border-2 border-gray-900 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900 font-mono uppercase">
                    {review.name}
                  </div>
                  <div className="text-sm text-gray-600 font-mono font-bold">
                    {review.role}
                  </div>
                </div>
              </div>
              <p className="text-gray-900 leading-relaxed font-mono font-medium">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
