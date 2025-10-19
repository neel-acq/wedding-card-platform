import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Ceremony {
  title: string;
  date: string;
  time: string;
  venue_name: string;
  venue_address: string;
  map_link?: string;
  image_url?: string;
}

interface CeremoniesSectionProps {
  ceremonies: Ceremony[];
}

const CeremoniesSection = ({ ceremonies }: CeremoniesSectionProps) => {
  if (!ceremonies || ceremonies.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-blush/10 to-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4 text-gradient-romantic">
          Wedding Ceremonies
        </h2>
        <p className="text-center text-muted-foreground mb-12 font-romantic">
          Join us in celebrating these special moments
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ceremonies.map((ceremony, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blush/20 to-lavender/20 rounded-3xl p-8 shadow-elegant hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {ceremony.image_url && (
                <div className="mb-6 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                    <img
                      src={ceremony.image_url}
                      alt={ceremony.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <h3 className="text-2xl md:text-3xl font-display font-bold text-center mb-6 text-foreground">
                {ceremony.title}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(ceremony.date), "EEEE, MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{ceremony.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium text-foreground mb-1">{ceremony.venue_name}</p>
                    <p className="text-sm text-muted-foreground">{ceremony.venue_address}</p>
                  </div>
                </div>
              </div>

              {ceremony.map_link && (
                <a
                  href={ceremony.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105"
                >
                  <MapPin className="w-4 h-4" />
                  View Location
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CeremoniesSection;