import { Heart, Sparkles, Image, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Beautiful Templates",
      description: "Choose from elegant, romantic wedding templates designed to capture your love story"
    },
    {
      icon: Sparkles,
      title: "Fully Customizable",
      description: "Personalize colors, fonts, and layouts to match your wedding theme perfectly"
    },
    {
      icon: Image,
      title: "Photo Galleries",
      description: "Showcase your precious moments with stunning photo galleries and video sections"
    },
    {
      icon: Users,
      title: "Family & Friends",
      description: "Introduce your families and share your love story with beautiful layouts"
    },
    {
      icon: MapPin,
      title: "Venue Details",
      description: "Display venue information with integrated maps and directions for your guests"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-blush/10 to-background">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552')] bg-cover bg-center opacity-5" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="mb-8 animate-float">
            <Heart className="w-20 h-20 mx-auto text-primary fill-primary" />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 animate-fade-in-up">
            <span className="text-gradient-romantic">Create Your Perfect</span>
            <br />
            <span className="text-foreground">Wedding Website</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-romantic animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Share your love story with beautiful, personalized wedding invitation websites. 
            Elegant templates, easy customization, and unforgettable experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
              onClick={() => navigate('/admin')}
            >
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                // Demo invitation - you can add a sample one later
                navigate('/invite/demo-wedding');
              }}
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-romantic">
              Everything You Need for Your Special Day
            </h2>
            <p className="text-lg text-muted-foreground font-romantic">
              Create a stunning online presence for your wedding with our comprehensive features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-elegant transition-shadow duration-300 animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-romantic">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
            Ready to Create Your Dream Wedding Website?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 font-romantic">
            Join thousands of happy couples who've shared their special moments with our platform
          </p>
          <Button 
            size="lg"
            className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
            onClick={() => navigate('/admin')}
          >
            Start Creating Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <Heart className="w-8 h-8 mx-auto mb-4 text-primary fill-primary" />
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Wedding Invitations. Making love stories unforgettable.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
