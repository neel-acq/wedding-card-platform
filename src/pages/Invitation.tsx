import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Heart, MapPin, Calendar, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import CountdownTimer from "@/components/CountdownTimer";
import LoveStorySection from "@/components/LoveStorySection";
import FamilySection from "@/components/FamilySection";
import GallerySection from "@/components/GallerySection";
import VenueSection from "@/components/VenueSection";
import CeremoniesSection from "@/components/CeremoniesSection";

interface Invitation {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  venue_map_link: string | null;
  cover_image_url: string | null;
  love_story: string | null;
  love_story_images: string[] | null;
  groom_family: any;
  bride_family: any;
  gallery_images: string[] | null;
  video_url: string | null;
  thank_you_message: string | null;
  template_type: string;
  theme_color: string;
  background_music_url: string | null;
  ceremonies: Array<{
    title: string;
    date: string;
    time: string;
    venue_name: string;
    venue_address: string;
    map_link?: string;
    image_url?: string;
  }> | null;
}

const Invitation = () => {
  const { slug } = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from("invitations")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setInvitation(data as unknown as Invitation);
        }
      } catch (error) {
        console.error("Error fetching invitation:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Invitation Not Found</h1>
        <p className="text-muted-foreground text-center">
          The wedding invitation you're looking for doesn't exist or hasn't been published yet.
        </p>
      </div>
    );
  }

  const weddingDate = new Date(invitation.wedding_date);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blush/20 to-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {invitation.cover_image_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${invitation.cover_image_url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <div className="mb-8 animate-float">
            <Heart className="w-16 h-16 mx-auto text-primary fill-primary" />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4">
            <span className="text-gradient-romantic">{invitation.groom_name}</span>
            <span className="text-foreground mx-4">&</span>
            <span className="text-gradient-romantic">{invitation.bride_name}</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-romantic text-muted-foreground mb-8">
            We're Getting Married!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-foreground/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">{format(weddingDate, "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">{invitation.wedding_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">{invitation.venue_name}</span>
            </div>
          </div>
          
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      {/* Love Story Section */}
      {invitation.love_story && (
        <LoveStorySection 
          story={invitation.love_story}
          images={invitation.love_story_images || []}
        />
      )}

      {/* Ceremonies Section */}
      {invitation.ceremonies && invitation.ceremonies.length > 0 && (
        <CeremoniesSection ceremonies={invitation.ceremonies} />
      )}

      {/* Venue Section */}
      <VenueSection 
        venueName={invitation.venue_name}
        address={invitation.venue_address}
        mapLink={invitation.venue_map_link}
      />

      {/* Family Section */}
      <FamilySection 
        groomFamily={invitation.groom_family}
        brideFamily={invitation.bride_family}
        groomName={invitation.groom_name}
        brideName={invitation.bride_name}
      />

      {/* Gallery Section */}
      {invitation.gallery_images && invitation.gallery_images.length > 0 && (
        <GallerySection images={invitation.gallery_images} />
      )}

      {/* Video Section */}
      {invitation.video_url && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 text-gradient-romantic">
              Our Story in Motion
            </h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-elegant">
              <iframe
                src={invitation.video_url}
                title="Wedding Video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Thank You Section */}
      {invitation.thank_you_message && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-12 h-12 mx-auto mb-6 text-primary fill-primary animate-float" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">
              Thank You
            </h2>
            <p className="text-lg font-romantic text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {invitation.thank_you_message}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {invitation.groom_name} & {invitation.bride_name}
        </p>
      </footer>
    </div>
  );
};

export default Invitation;
