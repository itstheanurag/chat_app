import { MessageSquare, CheckCircle2 } from "lucide-react";

const MainCard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-4 border-gray-900 p-8 md:p-12 shadow-background flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-3 bg-white border-2 border-gray-900 shadow-button px-4 py-2 text-gray-900 font-bold font-mono text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>PREMIUM MESSAGING</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-tertiary leading-tight">
            CONNECT WITH STYLE, <br />
            <span className="text-violet-500 drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]">
              CHAT WITH EASE.
            </span>
          </h2>

          <p className="text-lg text-gray-800 leading-relaxed font-mono font-medium">
            Experience messaging with a modern twist. Clean design meets
            powerful functionality in our beautifully crafted chat application.
          </p>

          <div className="space-y-4">
            {[
              "Secure end-to-end messaging",
              "Group conversations with unlimited members",
              "Read receipt tracking & typing indicators",
              "File sharing up to 2GB",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-gray-900 flex-shrink-0 fill-violet-500" />
                <span className="text-gray-900 font-bold font-mono">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-violet-200 border-4 border-gray-900 transform rotate-3 scale-95 opacity-100 z-0"></div>
          <div className="relative bg-gray-900 p-6 shadow-background overflow-hidden border-4 border-gray-900 z-10">
            {/* Mock Chat Interface */}
            <div className="flex items-center justify-between mb-6 border-b-2 border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-white bg-purple-500"></div>
                <div>
                  <div className="text-white font-bold text-sm font-mono">
                    DESIGN TEAM
                  </div>
                  <div className="text-gray-400 text-xs font-mono">
                    3 MEMBERS ONLINE
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 border border-white bg-red-500"></div>
                <div className="w-3 h-3 border border-white bg-yellow-500"></div>
                <div className="w-3 h-3 border border-white bg-green-500"></div>
              </div>
            </div>

            <div className="space-y-4 font-mono">
              <div className="flex gap-3">
                <div className="w-8 h-8 border border-white bg-gray-700 flex-shrink-0"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-xs font-bold">
                      ALEX
                    </span>
                    <span className="text-gray-500 text-[10px]">10:42 AM</span>
                  </div>
                  <div className="bg-white border-2 border-gray-700 text-gray-900 p-3 text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    Hey team! Just pushed the new updates. 🚀
                  </div>
                </div>
              </div>

              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 border border-white bg-violet-500 flex-shrink-0"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-gray-500 text-[10px]">10:44 AM</span>
                    <span className="text-gray-300 text-xs font-bold">YOU</span>
                  </div>
                  <div className="bg-violet-500 border-2 border-white text-white p-3 text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    Looks amazing! Love the new clean aesthetic. ✨
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 border border-white bg-gray-700 flex-shrink-0"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-xs font-bold">
                      SARAH
                    </span>
                    <span className="text-gray-500 text-[10px]">10:45 AM</span>
                  </div>
                  <div className="bg-white border-2 border-gray-700 text-gray-900 p-3 text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    The dark mode implementation is perfect.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-gray-700 flex gap-3">
              <div className="w-8 h-8 border-2 border-gray-600 bg-gray-800 flex items-center justify-center text-gray-400 font-bold">
                +
              </div>
              <div className="flex-1 bg-gray-800 border-2 border-gray-600 h-8 px-4 flex items-center text-gray-500 text-xs font-mono">
                TYPE A MESSAGE...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainCard;
