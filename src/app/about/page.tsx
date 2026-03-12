
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Brain,
  Rocket,
  Target,
  Lightbulb,
  Heart,
  Gem,
  Smile,
  Globe,
  Handshake,
  Cpu,
  Sprout,
  Puzzle,
  Paintbrush,
  Focus,
  Award,
  Users,
  BookOpen,
  Mail,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-12">
      <header className="text-center space-y-2">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary-foreground drop-shadow-lg flex items-center justify-center gap-4">
          <span className="text-yellow-400">🌟</span> About SmartyKids
        </h1>
        <p className="text-2xl text-muted-foreground font-semibold">
          🧠 Learning That Feels Like Play
        </p>
      </header>

      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="p-8">
          <p className="text-lg text-center">
            At SmartyKids, we believe that the best learning happens when
            children are having fun. Designed for ages 3 to 6, our app
            transforms traditional lessons into interactive adventures —
            blending play, creativity, and smart technology to help young
            learners grow with joy and confidence.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h2 className="font-headline text-3xl mb-4 flex items-center gap-3">
            <Rocket className="text-red-500 h-8 w-8" />
            Our Mission
          </h2>
          <p className="text-muted-foreground text-base">
            Our mission is to spark curiosity and a lifelong love for learning.
            SmartyKids uses AI-driven personalization to adapt each activity to
            a child’s pace, interests, and learning style — ensuring that every
            moment is engaging, encouraging, and effective. We make sure
            learning isn’t just smart — it’s emotionally enriching, inclusive,
            and fun.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-3xl mb-4 flex items-center gap-3">
            <Target className="text-blue-500 h-8 w-8" />
            Our Vision
          </h2>
          <p className="text-muted-foreground text-base">
            To create a world where every child, everywhere, has access to
            high-quality, fun, and personalized early education. We dream of
            making digital learning as delightful as a favorite game — and as
            meaningful as a classroom full of wonder.
          </p>
        </section>
      </div>

      <Separator />

      <section className="text-center">
        <h2 className="font-headline text-3xl mb-6 flex items-center justify-center gap-3">
          <Lightbulb className="text-yellow-500 h-8 w-8" />
          How SmartyKids Helps Your Child
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <Puzzle className="h-10 w-10 text-green-500" />
            <p>Learn letters, numbers, shapes, and colors</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Paintbrush className="h-10 w-10 text-purple-500" />
            <p>Build creativity & imagination</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Focus className="h-10 w-10 text-cyan-500" />
            <p>Develop focus, logic, and memory</p>
          </div>
          <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
            <Award className="h-10 w-10 text-yellow-400" />
            <p>Earn rewards that celebrate progress</p>
          </div>
        </div>
        <p className="mt-6 font-semibold">Each activity is designed to grow skills and smiles at the same time.</p>
      </section>
      
      <Separator />

      <section>
        <h2 className="font-headline text-3xl mb-4 flex items-center gap-3">
          <Heart className="text-pink-500 h-8 w-8" />
          Our Story
        </h2>
        <p className="text-muted-foreground text-base">
          SmartyKids began with one simple belief — that learning should never
          feel like a chore. Our team of educators, designers, and
          technologists came together to create a safe, playful environment
          that combines education, AI, and creativity. We’re inspired by the
          sparkle in every child’s eyes when they learn something new — and
          that’s what keeps us building every day.
        </p>
      </section>

      <Separator />

       <section>
        <h2 className="font-headline text-3xl mb-6 flex items-center justify-center gap-3">
          <Users className="text-cyan-500 h-8 w-8" />
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
                 <CardContent className="pt-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-secondary">
                        <AvatarImage src="https://i.ibb.co/PZjrHk3d/kishan.jpg" alt="Kishan Dutta" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">Kishan Dutta</h3>
                    <p className="text-primary-foreground font-semibold">Founder & CEO</p>
                    <p className="text-sm text-muted-foreground mt-2">A passionate educator with a dream to make learning joyful and accessible for every child.</p>
                 </CardContent>
            </Card>
             <Card className="text-center">
                 <CardContent className="pt-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-secondary">
                        <AvatarImage src="https://i.ibb.co/jkH8TwpQ/nandan.jpg" alt="nandan" />
                        <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">Shuvadeep Nnndan</h3>
                    <p className="text-primary-foreground font-semibold">Lead Designer</p>
                    <p className="text-sm text-muted-foreground mt-2">The creative mind behind our playful characters and engaging user experience.</p>
                 </CardContent>
            </Card>
             <Card className="text-center">
                 <CardContent className="pt-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-secondary">
                        <AvatarImage src="https://i.ibb.co/G49hCs4T/munna.png" alt="munna" />
                        <AvatarFallback>AE</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">Munna Ruhidas</h3>
                    <p className="text-primary-foreground font-semibold">Lead AI Engineer</p>
                    <p className="text-sm text-muted-foreground mt-2">The architect of our smart learning system, making sure the app grows with your child.</p>
                 </CardContent>
            </Card>
            <Card className="text-center">
                 <CardContent className="pt-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-secondary">
                        <AvatarImage src="https://i.ibb.co/4gCxzpDX/bila.jpg" alt="bila" />
                        <AvatarFallback>AE</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">Biplab Mondal</h3>
                    <p className="text-primary-foreground font-semibold">Lead AI Engineer</p>
                    <p className="text-sm text-muted-foreground mt-2">The architect of our smart learning system, making sure the app grows with your child.</p>
                 </CardContent>
            </Card>
        </div>
      </section>

      <Separator />
      
      <section>
        <h2 className="font-headline text-3xl mb-6 flex items-center justify-center gap-3">
          <Gem className="text-indigo-500 h-8 w-8" />
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-4 rounded-lg bg-muted/30">
                <Smile className="h-8 w-8 mx-auto mb-2 text-yellow-500"/>
                <h4 className="font-bold">Playfulness</h4>
                <p className="text-sm text-muted-foreground">Every lesson should bring a smile.</p>
            </div>
             <div className="p-4 rounded-lg bg-muted/30">
                <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500"/>
                <h4 className="font-bold">Curiosity</h4>
                <p className="text-sm text-muted-foreground">We encourage exploration.</p>
            </div>
             <div className="p-4 rounded-lg bg-muted/30">
                <Handshake className="h-8 w-8 mx-auto mb-2 text-red-500"/>
                <h4 className="font-bold">Inclusivity</h4>
                <p className="text-sm text-muted-foreground">Every child learns differently.</p>
            </div>
             <div className="p-4 rounded-lg bg-muted/30">
                <Cpu className="h-8 w-8 mx-auto mb-2 text-purple-500"/>
                <h4 className="font-bold">Innovation</h4>
                <p className="text-sm text-muted-foreground">We blend tech and creativity.</p>
            </div>
             <div className="p-4 rounded-lg bg-muted/30">
                <Sprout className="h-8 w-8 mx-auto mb-2 text-green-500"/>
                <h4 className="font-bold">Growth</h4>
                <p className="text-sm text-muted-foreground">We celebrate small wins.</p>
            </div>
        </div>
      </section>
      
      <Separator />

      <footer className="text-center space-y-6">
        <h2 className="font-headline text-3xl">🌟 Join the SmartyKids Family</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Whether you’re a parent, teacher, or curious explorer, SmartyKids is
          your partner in nurturing bright, confident learners. Together,
          let’s make learning smart, joyful, and limitless.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="font-bold text-lg">
                <Link href="/topics">
                    <BookOpen className="mr-2" />
                    Explore Activities
                </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold text-lg">
                <Link href="/rewards">
                    <Award className="mr-2" />
                    View Rewards
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold text-lg">
                <Link href="/contact">
                    <Mail className="mr-2" />
                    Contact Us
                </Link>
            </Button>
        </div>
      </footer>
    </div>
  );
}
