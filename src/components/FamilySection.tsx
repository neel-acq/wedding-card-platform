import { Users } from "lucide-react";

interface FamilyMember {
  name: string;
  relation: string;
}

interface FamilySectionProps {
  groomFamily: FamilyMember[];
  brideFamily: FamilyMember[];
  groomName: string;
  brideName: string;
}

const FamilySection = ({ groomFamily, brideFamily, groomName, brideName }: FamilySectionProps) => {
  if ((!groomFamily || groomFamily.length === 0) && (!brideFamily || brideFamily.length === 0)) {
    return null;
  }

  const FamilyCard = ({ title, members }: { title: string; members: FamilyMember[] }) => (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
      <h3 className="text-2xl font-display font-semibold text-center mb-6 text-primary">
        {title}
      </h3>
      <div className="space-y-4">
        {members.map((member, idx) => (
          <div 
            key={idx} 
            className="text-center pb-4 border-b border-border last:border-0 last:pb-0"
          >
            <p className="font-medium text-foreground text-lg">{member.name}</p>
            <p className="text-sm text-muted-foreground font-romantic">{member.relation}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-romantic">
            Our Families
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {groomFamily && groomFamily.length > 0 && (
            <FamilyCard title={`${groomName}'s Family`} members={groomFamily} />
          )}
          {brideFamily && brideFamily.length > 0 && (
            <FamilyCard title={`${brideName}'s Family`} members={brideFamily} />
          )}
        </div>
      </div>
    </section>
  );
};

export default FamilySection;
