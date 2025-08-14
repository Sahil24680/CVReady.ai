"use client";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default function MD({ text }: { text: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      components={{
       
        p: ({ children }) => (
          <p className="text-gray-700 text-md font-semibold leading-relaxed">
            {children}
          </p>
        ),
        
        li: ({ children }) => (
          <li className="text-gray-700 text-md font-semibold mb-1">{children}</li>
        ),

        em: ({ children }) => (
          <em className="text-gray-800 font-bold text-md ">{children}</em>
        ),
        strong: ({ children }) => (
          <strong className="text-md text-gray-800">{children}</strong>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
