import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card } from "./card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";

interface GlassBlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  author?: {
    name: string;
    avatar: string;
  };
  date?: string;
  readTime?: string;
  tags?: string[];
  className?: string;
  onClick?: () => void;
}

const defaultPost = {
  title: "The Future of UI Design",
  excerpt: "Exploring the latest trends in glassmorphism, 3D elements, and micro-interactions.",
  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  author: { name: "Moumen Soliman", avatar: "https://github.com/shadcn.png" },
  date: "Dec 2, 2025",
  readTime: "5 min read",
  tags: ["Design", "UI/UX"],
};

export function GlassBlogCard({
  title = defaultPost.title,
  excerpt = defaultPost.excerpt,
  image = defaultPost.image,
  author = defaultPost.author,
  date = defaultPost.date,
  readTime = defaultPost.readTime,
  tags = defaultPost.tags,
  className,
  onClick,
}: GlassBlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ width: '100%', maxWidth: '340px' }}
      className={className}
      onClick={onClick}
    >
      <Card 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer'
        }}
        className="group"
      >
        {/* IMAGE SECTION */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
          <img
            src={image}
            alt={title}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          
          {/* TAGS */}
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '8px' }}>
            {tags?.map((tag, i) => (
              <span key={i} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', borderRadius: '99px', fontSize: '10px', color: 'white', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* READ BUTTON */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }} className="group-hover:opacity-100 transition-opacity">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'black', color: 'white', padding: '10px 20px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold' }}>
              <BookOpen size={16} /> Read Article
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1, textAlign: 'left' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
              {title}
            </h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: 'rgba(100, 116, 139, 0.9)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {excerpt}
            </p>
          </div>

          {/* FOOTER */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* AVATAR - FORCED SMALL */}
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
                <img src={author.avatar} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{author.name}</span>
                <span style={{ fontSize: '9px', opacity: 0.6 }}>{date}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', opacity: 0.7 }}>
              <Clock size={12} /> {readTime}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
