interface CommentCardProps {
    name: string;
    role: string;
    company: string;
    comment: string;
    rating: number;
  }
  
  export default function CommentCard({ name, role, company, comment, rating }: CommentCardProps) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return (
      <div className="flex-none w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#06367a] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{name}</h4>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < rating ? 'text-[#60A5FA]' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2">{role} at {company}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{comment}</p>
          </div>
        </div>
      </div>
    );
  }
  