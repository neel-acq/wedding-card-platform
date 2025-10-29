import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Upload, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const InvitationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    groom_name: "",
    bride_name: "",
    wedding_date: "",
    wedding_time: "",
    venue_name: "",
    venue_address: "",
    venue_map_link: "",
    venue_map_embed_link: "",
    cover_image_url: "",
    love_story: "",
    thank_you_message: "",
    video_url: "",
    is_published: false,
  });

  const [groomFamily, setGroomFamily] = useState<{ name: string; relation: string }[]>([]);
  const [brideFamily, setBrideFamily] = useState<{ name: string; relation: string }[]>([]);
  const [ceremonies, setCeremonies] = useState<Array<{
    title: string;
    date: string;
    time: string;
    venue_name: string;
    venue_address: string;
    map_link: string;
    image_url: string;
  }>>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }
      
      if (isEditing) {
        fetchInvitation();
      }
    };
    
    checkAuth();
  }, [id, navigate]);

  const fetchInvitation = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          slug: data.slug || "",
          groom_name: data.groom_name || "",
          bride_name: data.bride_name || "",
          wedding_date: data.wedding_date ? new Date(data.wedding_date).toISOString().split('T')[0] : "",
          wedding_time: data.wedding_time || "",
          venue_name: data.venue_name || "",
          venue_address: data.venue_address || "",
          venue_map_link: data.venue_map_link || "",
          venue_map_embed_link: data.venue_map_embed_link || "",
          cover_image_url: data.cover_image_url || "",
          love_story: data.love_story || "",
          thank_you_message: data.thank_you_message || "",
          video_url: data.video_url || "",
          is_published: data.is_published || false,
        });
        
        setGroomFamily(Array.isArray(data.groom_family) ? data.groom_family as Array<{ name: string; relation: string }> : []);
        setBrideFamily(Array.isArray(data.bride_family) ? data.bride_family as Array<{ name: string; relation: string }> : []);
        setCeremonies(Array.isArray(data.ceremonies) ? data.ceremonies as Array<{
          title: string;
          date: string;
          time: string;
          venue_name: string;
          venue_address: string;
          map_link: string;
          image_url: string;
        }> : []);
        setGalleryImages(Array.isArray(data.gallery_images) ? data.gallery_images : []);
      }
    } catch (error: any) {
      toast.error("Failed to load invitation");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('wedding-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('wedding-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onCoverDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const url = await uploadImage(acceptedFiles[0]);
      setFormData(prev => ({ ...prev, cover_image_url: url }));
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } = useDropzone({
    onDrop: onCoverDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !formData.groom_name || !formData.bride_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const invitationData = {
        ...formData,
        groom_family: groomFamily,
        bride_family: brideFamily,
        ceremonies: ceremonies,
        gallery_images: galleryImages,
        wedding_date: new Date(formData.wedding_date).toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from("invitations")
          .update(invitationData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Invitation updated successfully");
      } else {
        const { error } = await supabase
          .from("invitations")
          .insert([invitationData]);

        if (error) throw error;
        toast.success("Invitation created successfully");
      }

      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to save invitation");
    } finally {
      setLoading(false);
    }
  };

  const addFamilyMember = (side: 'groom' | 'bride') => {
    const setter = side === 'groom' ? setGroomFamily : setBrideFamily;
    setter(prev => [...prev, { name: "", relation: "" }]);
  };

  const updateFamilyMember = (side: 'groom' | 'bride', index: number, field: 'name' | 'relation', value: string) => {
    const setter = side === 'groom' ? setGroomFamily : setBrideFamily;
    const family = side === 'groom' ? groomFamily : brideFamily;
    const updated = [...family];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

  const removeFamilyMember = (side: 'groom' | 'bride', index: number) => {
    const setter = side === 'groom' ? setGroomFamily : setBrideFamily;
    const family = side === 'groom' ? groomFamily : brideFamily;
    setter(family.filter((_, i) => i !== index));
  };

  const addCeremony = () => {
    setCeremonies(prev => [...prev, {
      title: "",
      date: "",
      time: "",
      venue_name: "",
      venue_address: "",
      map_link: "",
      image_url: "",
    }]);
  };

  const updateCeremony = (index: number, field: string, value: string) => {
    const updated = [...ceremonies];
    updated[index] = { ...updated[index], [field]: value };
    setCeremonies(updated);
  };

  const removeCeremony = (index: number) => {
    setCeremonies(ceremonies.filter((_, i) => i !== index));
  };

  const handleCeremonyDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = ceremonies.findIndex((_, i) => i === Number(active.id));
      const newIndex = ceremonies.findIndex((_, i) => i === Number(over.id));
      setCeremonies(arrayMove(ceremonies, oldIndex, newIndex));
    }
  };

  const handleFamilyDragEnd = (side: 'groom' | 'bride') => (event: DragEndEvent) => {
    const { active, over } = event;
    const family = side === 'groom' ? groomFamily : brideFamily;
    const setter = side === 'groom' ? setGroomFamily : setBrideFamily;
    
    if (over && active.id !== over.id) {
      const oldIndex = family.findIndex((_, i) => i === Number(active.id));
      const newIndex = family.findIndex((_, i) => i === Number(over.id));
      setter(arrayMove(family, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const uploadCeremonyImage = async (file: File, index: number) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      updateCeremony(index, 'image_url', url);
      toast.success("Ceremony image uploaded");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onGalleryDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const uploadPromises = acceptedFiles.map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      setGalleryImages(prev => [...prev, ...urls]);
      toast.success(`${acceptedFiles.length} image(s) uploaded to gallery`);
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps } = useDropzone({
    onDrop: onGalleryDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    toast.success("Image removed from gallery");
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blush/10 to-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-display font-bold">
            {isEditing ? "Edit Invitation" : "Create New Invitation"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groom_name">Groom's Name *</Label>
                  <Input
                    id="groom_name"
                    value={formData.groom_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, groom_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bride_name">Bride's Name *</Label>
                  <Input
                    id="bride_name"
                    value={formData.bride_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, bride_name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug * (e.g., john-and-jane)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  placeholder="aarav-and-meera"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Your invitation will be available at: /invite/{formData.slug || 'your-slug'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wedding_date">Wedding Date *</Label>
                  <Input
                    id="wedding_date"
                    type="date"
                    value={formData.wedding_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, wedding_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wedding_time">Wedding Time *</Label>
                  <Input
                    id="wedding_time"
                    value={formData.wedding_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, wedding_time: e.target.value }))}
                    placeholder="4:00 PM"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Venue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venue_name">Venue Name *</Label>
                <Input
                  id="venue_name"
                  value={formData.venue_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue_address">Venue Address *</Label>
                <Textarea
                  id="venue_address"
                  value={formData.venue_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue_address: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue_map_link">Google Maps Link (for "Get Directions" button)</Label>
                <Input
                  id="venue_map_link"
                  value={formData.venue_map_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue_map_link: e.target.value }))}
                  placeholder="https://www.google.com/maps/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue_map_embed_link">Google Maps Embed Link (for map display)</Label>
                <Input
                  id="venue_map_embed_link"
                  value={formData.venue_map_embed_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue_map_embed_link: e.target.value }))}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-xs text-muted-foreground">
                  Get embed link: Google Maps → Share → Embed a map → Copy HTML (use the src URL)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getCoverRootProps()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <input {...getCoverInputProps()} />
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                ) : formData.cover_image_url ? (
                  <div className="space-y-2">
                    <img src={formData.cover_image_url} alt="Cover" className="max-h-40 mx-auto rounded" />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop an image here, or click to select
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Love Story</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.love_story}
                onChange={(e) => setFormData(prev => ({ ...prev, love_story: e.target.value }))}
                rows={6}
                placeholder="Share your beautiful love story..."
              />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Family Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Groom's Family</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addFamilyMember('groom')}>
                    Add Member
                  </Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFamilyDragEnd('groom')}>
                  <SortableContext items={groomFamily.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {groomFamily.map((member, idx) => (
                        <SortableFamilyItem
                          key={idx}
                          id={idx}
                          member={member}
                          onUpdate={(field, value) => updateFamilyMember('groom', idx, field, value)}
                          onRemove={() => removeFamilyMember('groom', idx)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Bride's Family</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addFamilyMember('bride')}>
                    Add Member
                  </Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFamilyDragEnd('bride')}>
                  <SortableContext items={brideFamily.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {brideFamily.map((member, idx) => (
                        <SortableFamilyItem
                          key={idx}
                          id={idx}
                          member={member}
                          onUpdate={(field, value) => updateFamilyMember('bride', idx, field, value)}
                          onRemove={() => removeFamilyMember('bride', idx)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Wedding Ceremonies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Add multiple ceremonies like Mehendi, Sangeet, Wedding, Reception, etc.</p>
                  <Button type="button" variant="outline" onClick={addCeremony}>
                    Add Ceremony
                  </Button>
                </div>
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCeremonyDragEnd}>
                  <SortableContext items={ceremonies.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                    {ceremonies.map((ceremony, idx) => (
                      <SortableCeremonyItem
                        key={idx}
                        id={idx}
                        ceremony={ceremony}
                        ceremonyNumber={idx + 1}
                        onUpdate={(field, value) => updateCeremony(idx, field, value)}
                        onRemove={() => removeCeremony(idx)}
                        onImageUpload={(file) => uploadCeremonyImage(file, idx)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getGalleryRootProps()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <input {...getGalleryInputProps()} />
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop images here, or click to select multiple images
                    </p>
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL (YouTube embed link)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thank_you_message">Thank You Message</Label>
                <Textarea
                  id="thank_you_message"
                  value={formData.thank_you_message}
                  onChange={(e) => setFormData(prev => ({ ...prev, thank_you_message: e.target.value }))}
                  rows={4}
                  placeholder="Thank your guests..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Publish invitation (make it visible to public)</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Invitation" : "Create Invitation"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sortable Family Member Component
const SortableFamilyItem = ({ id, member, onUpdate, onRemove }: {
  id: number;
  member: { name: string; relation: string };
  onUpdate: (field: 'name' | 'relation', value: string) => void;
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-center">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      <Input
        placeholder="Name"
        value={member.name}
        onChange={(e) => onUpdate('name', e.target.value)}
      />
      <Input
        placeholder="Relation"
        value={member.relation}
        onChange={(e) => onUpdate('relation', e.target.value)}
      />
      <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Sortable Ceremony Component
const SortableCeremonyItem = ({ id, ceremony, ceremonyNumber, onUpdate, onRemove, onImageUpload }: {
  id: number;
  ceremony: any;
  ceremonyNumber: number;
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
  onImageUpload: (file: File) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          <h4 className="font-semibold">Ceremony {ceremonyNumber}</h4>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={ceremony.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="e.g., Mehendi Ceremony"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={ceremony.date}
              onChange={(e) => onUpdate('date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              value={ceremony.time}
              onChange={(e) => onUpdate('time', e.target.value)}
              placeholder="e.g., 4:00 PM"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Venue Name</Label>
          <Input
            value={ceremony.venue_name}
            onChange={(e) => onUpdate('venue_name', e.target.value)}
            placeholder="e.g., Hyatt Regency Delhi"
          />
        </div>

        <div className="space-y-2">
          <Label>Venue Address</Label>
          <Textarea
            value={ceremony.venue_address}
            onChange={(e) => onUpdate('venue_address', e.target.value)}
            placeholder="Full address"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Google Maps Link</Label>
          <Input
            value={ceremony.map_link}
            onChange={(e) => onUpdate('map_link', e.target.value)}
            placeholder="https://www.google.com/maps/..."
          />
        </div>

        <div className="space-y-2">
          <Label>Ceremony Image</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4">
            {ceremony.image_url ? (
              <div className="space-y-2">
                <img src={ceremony.image_url} alt={ceremony.title} className="max-h-32 mx-auto rounded" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
                />
              </div>
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvitationForm;
