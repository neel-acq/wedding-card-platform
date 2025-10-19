import { Heart } from "lucide-react";

interface LoveStorySectionProps {
  story: string;
  images: string[];
}

const LoveStorySection = ({ story, images }: LoveStorySectionProps) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-10 h-10 mx-auto mb-4 text-primary fill-primary animate-float" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-romantic">
            Our Love Story
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.slice(0, 4).map((img, idx) => (
                <div 
                  key={idx}
                  className="relative overflow-hidden rounded-xl shadow-soft aspect-square animate-scale-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <img 
                    src={img} 
                    alt={`Love story ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className={images.length === 0 ? "md:col-span-2" : ""}>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
              <p className="text-lg font-romantic text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {story}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveStorySection;
