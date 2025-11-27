import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-4 border-gray-900 bg-white shadow-button transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold font-mono text-lg text-gray-900">
          {question}
        </span>
        {isOpen ? (
          <Minus className="w-6 h-6 border-2 border-gray-900 rounded bg-violet-200 text-gray-900" />
        ) : (
          <Plus className="w-6 h-6 border-2 border-gray-900 rounded bg-white text-gray-900" />
        )}
      </button>
      {isOpen && (
        <div className="p-6 pt-0 border-t-4 border-gray-900 bg-gray-50">
          <p className="font-mono text-gray-800 leading-relaxed font-medium">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Is ChatApp really free?",
      answer:
        "Yes! ChatApp is completely free to use for personal communication. We believe in open and accessible messaging for everyone.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We use end-to-end encryption for all messages. Your conversations are private and can only be read by you and the recipient.",
    },
    {
      question: "Can I use it on mobile?",
      answer:
        "Absolutely. ChatApp is fully responsive and works great on all devices, including smartphones and tablets.",
    },
    {
      question: "How do I create a group?",
      answer:
        "Once logged in, simply click the 'New Group' button, select your friends, and start chatting instantly.",
    },
  ];

  return (
    <section className="py-24 px-4 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold font-tertiary text-gray-900 uppercase tracking-wider">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-900 font-mono font-bold">
          Everything you need to know about ChatApp.
        </p>
      </div>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <FAQItem key={index} {...faq} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
