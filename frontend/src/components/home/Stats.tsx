const Stats = () => {
  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Messages Sent", value: "1M+" },
    { label: "Countries", value: "50+" },
  ];

  return (
    <section className="w-full bg-violet-500 border-b-4 border-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y-4 md:divide-y-0 md:divide-x-4 divide-gray-900">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2 pt-8 md:pt-0">
            <div className="text-5xl font-tertiary text-white drop-shadow-[4px_4px_0px_rgba(15,23,42,1)]">
              {stat.value}
            </div>
            <div className="text-lg font-bold text-gray-900 uppercase tracking-wider font-mono">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
