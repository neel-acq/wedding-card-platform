import { MapPin, Navigation } from "lucide-react";
import { Button } from "./ui/button";

interface VenueSectionProps {
  venueName: string;
  address: string;
  mapLink: string | null;
  mapEmbedLink: string | null;
}

const VenueSection = ({ venueName, address, mapLink, mapEmbedLink }: VenueSectionProps) => {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <MapPin className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-romantic">
            Wedding Venue
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
            <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
              {venueName}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {address}
            </p>
            {mapLink && (
              <Button 
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <a 
                  href={mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </Button>
            )}
          </div>
          
          {mapEmbedLink && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-elegant">
              <iframe
                src={mapEmbedLink}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding Venue Map"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
