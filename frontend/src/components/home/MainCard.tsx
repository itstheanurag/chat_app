import { MessageSquare } from "lucide-react";

const MainCard = () => {
  return (
    <div className="max-w-8xl">
      <div className="bg-white border-4 p-12 shadow-background">
        <div className="flex items-center gap-4 mb-8 text-neutral-800">
          <div className="w-16 h-16 bg-orange-500 flex items-center justify-center shadow-button">
            <MessageSquare className="h-8 w-8 text-neutral-100" />
          </div>
          <h1 className="text-4xl font-bold ">ChatVintage</h1>
        </div>

        <h2 className="text-2xl font-bold  mb-4">Connect with Style</h2>
        <p className="text-lg text-neutral-700 leading-relaxed mb-8">
          Experience messaging with a modern vintage twist. Clean design meets
          powerful functionality in our beautifully crafted chat application.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-500 border border-gray-900"></div>
            <span className="text-gray-700">Secure end-to-end messaging</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-orange-400 border border-gray-900"></div>
            <span className="text-gray-700">Group conversations</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-blue-500 border border-gray-900"></div>
            <span className="text-gray-700">Read receipt tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
