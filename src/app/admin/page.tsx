

'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, doc, writeBatch } from 'firebase/firestore';
import type { User } from '@/lib/user';
import { topics } from '@/lib/data';
import { Medal, Users, Star, Search, User as UserIcon, Edit, BarChart3, PieChart, MoreVertical, Loader2, ShieldAlert, Home, ShieldCheck, PlusCircle, RotateCcw, LineChart, BrainCircuit, Database, Palette, Server, Smartphone, Clapperboard, Bot, BookOpen, Trophy, ArrowRight, ArrowDown, ArrowUp, Share2, Brush, Code, CheckCircle, Lightbulb, ToyBrick, Speech, KeyRound, Laptop, Info, Monitor, Tablet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { rewards } from '@/lib/rewards-data';
import { useAuth } from '@/firebase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useIsAdmin } from '@/lib/admin';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const medalOrder = [
    'smartymaster-medal',
    'diamond-medal',
    'platinum-medal',
    'gold-medal',
    'silver-medal',
    'bronze-medal'
];

const medalRankMap: Record<string, number> = medalOrder.reduce((acc, medalId, index) => {
    acc[medalId] = index;
    return acc;
}, {} as Record<string, number>);

const getHighestMedal = (userMedals: string[] | undefined): string | null => {
    if (!userMedals || userMedals.length === 0) return null;
    
    // Prioritize the admin medal if it exists
    if (userMedals.includes('admin-medal')) {
        return 'admin-medal';
    }

    let highestRank = medalOrder.length;
    let highestMedalId: string | null = null;
    for(const medalId of userMedals){
        if(medalRankMap[medalId] !== undefined && medalRankMap[medalId] < highestRank){
            highestRank = medalRankMap[medalId];
            highestMedalId = medalId;
        }
    }
    return highestMedalId;
};

const MEDAL_COLORS = {
  'SmartyMaster': '#E100FF',
  'Diamond Medal': '#21D4FD',
  'Platinum Medal': '#E5E4E2',
  'Gold Medal': '#FFD700',
  'Silver Medal': '#C0C0C0',
  'Bronze Medal': '#CD7F32',
  'No Medal': '#6c757d'
};

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];


const pointFields = topics.reduce((acc, topic) => {
    acc[topic.id] = z.coerce.number().min(0, 'Points must be non-negative.');
    return acc;
}, {} as Record<string, z.ZodNumber>);


const UserEditSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  isAdmin: z.boolean(),
  medals: z.array(z.string()),
  ...pointFields,
});


function EditUserForm({ user, onFinished }: { user: User & { totalPoints: number }; onFinished: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [pointsToAdd, setPointsToAdd] = useState(0);
  
  const defaultValues = useMemo(() => {
    const topicPoints = topics.reduce((acc, topic) => {
      acc[topic.id] = user.topicProgress?.[topic.id]?.points ?? 0;
      return acc;
    }, {} as Record<string, number>);

    return {
      username: user.username,
      isAdmin: user.isAdmin ?? false,
      medals: user.medals ?? [],
      ...topicPoints
    };
  }, [user]);

  const form = useForm<z.infer<typeof UserEditSchema>>({
    resolver: zodResolver(UserEditSchema),
    defaultValues,
  });

  const handleResetPoints = () => {
    topics.forEach(topic => {
      form.setValue(topic.id as keyof z.infer<typeof UserEditSchema>, 0);
    });
    toast({
        title: 'Points Reset',
        description: "All topic points have been set to 0 in the form. Click 'Save Changes' to confirm.",
    });
  }

  const handleAddPoints = () => {
    if (pointsToAdd <= 0) return;
    topics.forEach(topic => {
      const currentPoints = form.getValues(topic.id as keyof z.infer<typeof UserEditSchema>) as number;
      form.setValue(topic.id as keyof z.infer<typeof UserEditSchema>, currentPoints + pointsToAdd);
    });
    toast({
        title: 'Points Added',
        description: `${pointsToAdd} points have been added to each topic in the form. Click 'Save Changes' to confirm.`,
    });
    setPointsToAdd(0);
  }

  const onSubmit = async (values: z.infer<typeof UserEditSchema>) => {
    if (!firestore) return;

    const batch = writeBatch(firestore);
    const userRef = doc(firestore, 'users', user.id);

    const updatedTopicProgress = { ...user.topicProgress };
    for (const topic of topics) {
      if (!updatedTopicProgress[topic.id]) {
        updatedTopicProgress[topic.id] = { level: 1, points: 0 };
      }
      updatedTopicProgress[topic.id].points = values[topic.id];
    }
    
    const wasAdmin = user.isAdmin ?? false;
    const isNowAdmin = values.isAdmin;
    let newMedalsArray = [...values.medals];
    let previousMedals: string[] | null = user.previousMedals ?? null;

    // Logic for becoming an admin
    if (isNowAdmin && !wasAdmin) {
      previousMedals = newMedalsArray.filter(m => m !== 'admin-medal'); // Save current medals
      newMedalsArray = ['admin-medal'];
    }
    
    // Logic for losing admin status
    if (!isNowAdmin && wasAdmin) {
      newMedalsArray = previousMedals ?? ['bronze-medal']; // Restore old medals or give bronze
      previousMedals = null; // Clear the backup
    }

    // Filter out admin-medal if not admin, add it if admin
    newMedalsArray = newMedalsArray.filter(m => m !== 'admin-medal');
    if (isNowAdmin) {
      newMedalsArray.push('admin-medal');
    }
    
    const finalUpdate: Partial<User> = {
      username: values.username,
      isAdmin: values.isAdmin,
      topicProgress: updatedTopicProgress,
      medals: newMedalsArray,
    };

    if (previousMedals !== null) {
      finalUpdate.previousMedals = previousMedals;
    } else {
      finalUpdate.previousMedals = []; // Ensure the field is cleared if null
    }

    batch.update(userRef, finalUpdate);
    
    const currentMedals = new Set(user.medals || []);
    const formMedals = new Set(newMedalsArray);

    // Add new medals
    for (const medalId of formMedals) {
      if (!currentMedals.has(medalId)) {
        const rewardRef = doc(firestore, 'users', user.id, 'rewards', medalId);
        batch.set(rewardRef, {
          id: medalId,
          rewardId: medalId,
          userId: user.id,
          acquisitionDate: new Date().toISOString(),
          isUsed: false,
        });
      }
    }

    // Remove old medals
    for (const medalId of currentMedals) {
      if (!formMedals.has(medalId)) {
        const rewardRef = doc(firestore, 'users', user.id, 'rewards', medalId);
        batch.delete(rewardRef);
      }
    }

    try {
      await batch.commit();
      toast({
        title: 'User Updated',
        description: `${values.username}'s profile has been updated.`,
      });
      onFinished();
    } catch (error) {
       const permissionError = new FirestorePermissionError({
          path: `batch operation on user ${user.id}`,
          operation: 'write',
          requestResourceData: { 
            description: "A batch write updating user profile, medals, and rewards.",
            updatedUserData: {
              username: values.username,
              isAdmin: values.isAdmin,
              medals: newMedalsArray,
            }
          },
       });
       errorEmitter.emit('permission-error', permissionError);
    }
  };
  
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Admin Access</FormLabel>
                            <CardDescription>Grant this user administrative privileges.</CardDescription>
                        </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Separator />

                <div>
                  <h4 className="font-medium text-lg mb-2">Manage Points</h4>
                  <CardDescription className="mb-4">
                    Edit points for each topic, or use the quick actions to add or reset points for all topics at once.
                  </CardDescription>
                  <div className="grid grid-cols-2 gap-4">
                    {topics.map(topic => (
                       <FormField
                          key={topic.id}
                          control={form.control}
                          name={topic.id as keyof typeof pointFields}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="capitalize">{topic.name}</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    ))}
                  </div>
                  <div className='mt-4 space-y-4'>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="number" 
                            placeholder="Points to add" 
                            value={pointsToAdd || ''} 
                            onChange={e => setPointsToAdd(parseInt(e.target.value, 10) || 0)} 
                        />
                        <Button type="button" onClick={handleAddPoints} variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                     <Button type="button" onClick={handleResetPoints} variant="destructive" className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset All Points to 0
                    </Button>
                  </div>
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="medals"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Manage Medals</FormLabel>
                        <CardDescription>
                          Select the medals this user has earned. The Admin Medal is assigned automatically.
                        </CardDescription>
                      </div>
                      <div className="space-y-2">
                        {rewards.map((reward) => (
                           <FormField
                                key={reward.id}
                                control={form.control}
                                name="medals"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={reward.id}
                                    className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(reward.id)}
                                        onCheckedChange={(checked) => {
                                            if (reward.id === 'admin-medal') return; // Prevent manual toggling
                                            return checked
                                            ? field.onChange([...field.value, reward.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                    (value) => value !== reward.id
                                                )
                                                )
                                        }}
                                        disabled={reward.id === 'admin-medal'}
                                        />
                                    </FormControl>
                                    <Image src={reward.imageUrl} alt={reward.name} width={24} height={24} />
                                    <FormLabel className={cn("font-normal text-base", reward.id === 'admin-medal' && "text-muted-foreground")}>
                                        {reward.name}
                                    </FormLabel>
                                    </FormItem>
                                )
                                }}
                            />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                 <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> Editing email or password is not available. These are sensitive security operations that must be handled by the user themselves for their own account.
                    </p>
                 </div>
            </div>
        </ScrollArea>

        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
        </Button>
      </form>
    </Form>
  )
}

const coreFeatures = [
    { icon: BookOpen, title: "Graded Lessons", description: "Curated topics like alphabets and numbers with increasing difficulty and an unlock system to keep kids engaged." },
    { icon: Trophy, title: "Reward System", description: "Stars, badges, coins, and gems for completing levels, with a shop for stickers and themes to keep motivation high." },
    { icon: Lightbulb, title: "AI-Powered Tips", description: "When a child struggles, our AI tutor provides simple, friendly guidance to help them understand the concept." },
    { icon: CheckCircle, title: "Varied Question Types", description: "Multiple-choice and fill-in-the-blank questions with image aids and audio narration for a rich learning experience." },
    { icon: KeyRound, title: "Admin Question Editor", description: "A password-protected JSON admin panel for administrators to easily edit and manage quiz content." },
    { icon: Laptop, title: "Cross-Platform", description: "Built with Next.js and ShadCN, our app is responsive and works beautifully across desktop and mobile devices." }
];

const techStack = {
    frontend: [
        { name: "Next.js 15 & React 18", description: "Utilizes the App Router, Server Components, and Server Actions for a high-performance, modern web experience." },
        { name: "ShadCN UI & Tailwind CSS", description: "A component library built on Tailwind for a beautiful, responsive, and accessible design system." },
        { name: "TypeScript", description: "Ensures type safety and improves code quality and maintainability across the entire application." },
        { name: "Framer Motion", description: "Adds fluid animations and micro-interactions to create a delightful and engaging user experience." },
    ],
    backend: [
        { name: "Firebase", description: "Provides a comprehensive backend-as-a-service (BaaS) for authentication, database, and hosting." },
        { name: "Firebase Authentication", description: "Manages user sign-up and login securely using email and password." },
        { name: "Firestore Database", description: "A NoSQL database for storing user profiles, progress, and rewards, with security rules to protect data." }
    ],
    ai: [
        { name: "Genkit (by Google)", description: "An open-source AI framework for building production-ready AI-powered features and flows." },
        { name: "Server Actions", description: "Next.js server functions that are called from the client, used to securely run Genkit flows on the server." },
        { name: "Google AI Platform (Gemini)", description: "Powers the AI tip generation, providing contextual and helpful hints to learners." }
    ]
};

function InfoTabContent() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <header className="text-center space-y-2">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary-foreground drop-shadow-lg">
          Info SmartyKids
        </h1>
        <p className="text-xl text-muted-foreground">
          A Comprehensive Technical Report for Project Presentation
        </p>
      </header>

      <Separator />

      <section>
        <Card className="shadow-lg rounded-[20px] border-2">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-primary" />
              Project Vision & Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            <p>
              <strong>Vision:</strong> To create a modern, engaging, and personalized educational platform for nursery-aged children (3-6 years old) that makes learning foundational concepts a joyful and interactive experience.
            </p>
            <p>
              <strong>Mission:</strong> SmartyKids leverages cutting-edge web technologies and Generative AI to deliver a gamified learning environment. The platform offers structured quizzes and provides dynamic, AI-powered tips that adapt to the child&apos;s learning needs, keeping them motivated with a fun reward system.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-headline text-3xl text-center mb-6">Core Features & Functionality</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="shadow-lg rounded-[20px] border-2 flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-3 bg-primary/10 rounded-full">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl text-center mb-6">System Architecture & Technical Stack</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg rounded-[20px] border-2">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-3">
                <Share2 className="h-7 w-7 text-primary" />
                High-Level Architecture Diagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                {/* User/Client */}
                <div className="flex justify-center">
                    <div className="bg-accent/30 border-2 border-accent text-accent-foreground p-4 rounded-lg flex items-center gap-3 w-fit shadow-md">
                        <Smartphone className="h-6 w-6" />
                        <span className="font-bold">User&apos;s Browser (Client)</span>
                    </div>
                </div>
                <div className="flex justify-center"> <ArrowRight className="h-8 w-8 rotate-90 text-muted-foreground" /></div>
                
                {/* Next.js Frontend */}
                <div className="bg-background border-2 border-border p-4 rounded-lg shadow-md text-center">
                    <div className="font-bold flex items-center justify-center gap-2"><Server className="h-5 w-5" /> Next.js Application</div>
                    <p className="text-sm text-muted-foreground">React Server & Client Components</p>
                </div>

                {/* Arrows to Backend/AI */}
                <div className="flex justify-around">
                    <ArrowRight className="h-8 w-8 -rotate-45 text-muted-foreground" />
                    <ArrowRight className="h-8 w-8 rotate-45 text-muted-foreground" />
                </div>

                {/* Firebase & Genkit */}
                <div className="flex justify-around gap-4">
                   <div className="bg-background border-2 border-border p-4 rounded-lg shadow-md text-center w-1/2">
                       <div className="font-bold flex items-center justify-center gap-2"><Database className="h-5 w-5 text-yellow-500" /> Firebase</div>
                       <p className="text-sm text-muted-foreground">Authentication & Firestore DB</p>
                   </div>
                   <div className="bg-background border-2 border-border p-4 rounded-lg shadow-md text-center w-1/2">
                       <div className="font-bold flex items-center justify-center gap-2"><Bot className="h-5 w-5 text-blue-500" /> Genkit AI Flows</div>
                       <p className="text-sm text-muted-foreground">AI Tip Generation (Server Action)</p>
                   </div>
                </div>
                 <div className="flex justify-end pr-10"> <ArrowRight className="h-8 w-8 rotate-90 text-muted-foreground" /></div>
                 <div className="flex justify-end">
                    <div className="bg-background border-2 border-border p-4 rounded-lg shadow-md text-center w-1/2">
                       <div className="font-bold flex items-center justify-center gap-2"><BrainCircuit className="h-5 w-5 text-purple-500" /> Google AI Platform</div>
                       <p className="text-sm text-muted-foreground">Gemini Model</p>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-[20px] border-2">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-3">
                <Code className="h-7 w-7 text-primary" />
                Line-by-Line Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold text-lg"><Brush className="h-5 w-5 text-green-500 mr-2" />Frontend</AccordionTrigger>
                  <AccordionContent className="pl-4 space-y-3">
                    {techStack.frontend.map(tech => (
                        <div key={tech.name}>
                            <p className="font-semibold">{tech.name}</p>
                            <p className="text-muted-foreground text-sm">{tech.description}</p>
                        </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="font-bold text-lg"><Database className="h-5 w-5 text-yellow-500 mr-2" />Backend & Database</AccordionTrigger>
                  <AccordionContent className="pl-4 space-y-3">
                     {techStack.backend.map(tech => (
                        <div key={tech.name}>
                            <p className="font-semibold">{tech.name}</p>
                            <p className="text-muted-foreground text-sm">{tech.description}</p>
                        </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="font-bold text-lg"><BrainCircuit className="h-5 w-5 text-purple-500 mr-2" />Artificial Intelligence</AccordionTrigger>
                  <AccordionContent className="pl-4 space-y-3">
                    {techStack.ai.map(tech => (
                        <div key={tech.name}>
                            <p className="font-semibold">{tech.name}</p>
                            <p className="text-muted-foreground text-sm">{tech.description}</p>
                        </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function AdminDashboard() {
  const firestore = useFirestore();
  const { isAdmin, isLoading: isAdminLoading, requiresClaims, setRequiresClaims } = useIsAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<(User & { totalPoints: number, maxLevel: number }) | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'));
  }, [firestore]);

  const { data: users, isLoading: isUsersLoading } = useCollection<User>(usersQuery);

  const processedUsers = useMemo(() => {
    if (!users) return [];
    return users.map(user => {
      let totalPoints = 0;
      let maxLevel = 0;
      if (user.topicProgress) {
        for (const topicId in user.topicProgress) {
          totalPoints += user.topicProgress[topicId].points || 0;
          maxLevel = Math.max(maxLevel, user.topicProgress[topicId].level || 1);
        }
      }
      return { ...user, totalPoints, maxLevel: maxLevel - 1 };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [users]);
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return processedUsers;
    return processedUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedUsers, searchTerm]);
  
  const analyticsData = useMemo(() => {
      if (!users || users.length === 0) return { 
          totalMedals: 0, 
          medalDistribution: [], 
          dailySignups: [],
          topicAveragePoints: [],
          topicAverageLevels: [],
          totalPointsAllTime: 0,
          highestLevelAllTime: 0
      };

      const medals = users.reduce((acc, user) => acc + (user.medals?.length || 0), 0);

      const distribution = users.reduce((acc, user) => {
        const highestMedalId = getHighestMedal(user.medals || []);
        const medalName = rewards.find(r => r.id === highestMedalId)?.name || 'No Medal';
        acc[medalName] = (acc[medalName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const medalChartData = Object.entries(distribution).map(([name, value]) => ({
          name,
          value,
      }));
      
      const signupCounts = Array.from({length: 7}).map((_, i) => {
          const date = subDays(new Date(), i);
          const formattedDate = format(date, 'MMM d');
          return { date: formattedDate, count: 0 };
      }).reverse();

      const signupMap = signupCounts.reduce((acc, item) => {
        acc[item.date] = item;
        return acc;
      }, {} as Record<string, {date: string, count: number}>);

      users.forEach(user => {
        if(user.createdAt){
            try {
              const signupDate = format(new Date(user.createdAt), 'MMM d');
              if(signupMap[signupDate]){
                  signupMap[signupDate].count++;
              }
            } catch (e) {
                // Ignore invalid date formats
            }
        }
      });
      
      const topicStats = topics.reduce((acc, topic) => {
          acc[topic.id] = { totalPoints: 0, totalLevels: 0, userCount: 0 };
          return acc;
      }, {} as Record<string, { totalPoints: number, totalLevels: number, userCount: number }>);
      
      let totalPointsAllTime = 0;
      let highestLevelAllTime = 0;

      users.forEach(user => {
          if(user.topicProgress) {
              for (const topicId in user.topicProgress) {
                  if(topicStats[topicId]) {
                      const progress = user.topicProgress[topicId];
                      topicStats[topicId].totalPoints += progress.points || 0;
                      topicStats[topicId].totalLevels += (progress.level || 1) - 1;
                      topicStats[topicId].userCount++;
                      totalPointsAllTime += progress.points || 0;
                      highestLevelAllTime = Math.max(highestLevelAllTime, (progress.level || 1) - 1);
                  }
              }
          }
      });

      const topicAveragePoints = topics.map(topic => ({
          name: topic.name,
          average: topicStats[topic.id].userCount > 0 ? parseFloat((topicStats[topic.id].totalPoints / topicStats[topic.id].userCount).toFixed(1)) : 0
      }));
      
      const topicAverageLevels = topics.map(topic => ({
          name: topic.name,
          average: topicStats[topic.id].userCount > 0 ? parseFloat((topicStats[topic.id].totalLevels / topicStats[topic.id].userCount).toFixed(1)) : 0
      }));

      return { 
          totalMedals: medals, 
          medalDistribution: medalChartData, 
          dailySignups: signupCounts,
          topicAveragePoints,
          topicAverageLevels,
          totalPointsAllTime,
          highestLevelAllTime
      };
  }, [users]);

  const averagePoints = users && users.length > 0 ? (processedUsers.reduce((acc, user) => acc + user.totalPoints, 0) / users.length).toFixed(1) : 0;
  
  const handleEditClick = (user: User & { totalPoints: number, maxLevel: number }) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  }

  const isLoading = isUsersLoading || isAdminLoading;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg">
          Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Live monitoring of application metrics and user management.
        </p>
      </header>

      {requiresClaims && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Admin Access Update</AlertTitle>
          <AlertDescription>
            Admin functionality now requires a custom claim on your user account.
            Please follow the instructions in the Firebase documentation to set the `{`"admin": true`}` claim on your user account to regain access.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{users?.length ?? 0}</div>}
                    <p className="text-xs text-muted-foreground">
                      Total number of registered users.
                    </p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Points Per User</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{averagePoints}</div>}
                    <p className="text-xs text-muted-foreground">
                      Average total points across all users.
                    </p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Medals Awarded
                    </CardTitle>
                    <Medal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{analyticsData.totalMedals}</div>}
                    <p className="text-xs text-muted-foreground">
                      Total medals earned by all users.
                    </p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">All-Time Stats</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 pt-6">
                    {isLoading ? <Skeleton className="h-8 w-3/4" /> : 
                        <div>
                            <div className="text-2xl font-bold">{analyticsData.totalPointsAllTime}</div>
                            <p className="text-xs text-muted-foreground">Total points earned.</p>
                        </div>
                    }
                      {isLoading ? <Skeleton className="h-8 w-3/4" /> : 
                        <div>
                            <div className="text-2xl font-bold">{analyticsData.highestLevelAllTime}</div>
                            <p className="text-xs text-muted-foreground">Highest level reached.</p>
                        </div>
                    }
                  </CardContent>
                </Card>
              </div>
        </TabsContent>
        <TabsContent value="users" className="mt-6">
            <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Search, view, and manage all registered users.</CardDescription>
                  <div className="relative pt-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users by name or email..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                    {!isLoading && filteredUsers.map(user => {
                      const highestMedalId = getHighestMedal(user.medals);
                      const highestMedal = rewards.find(r => r.id === highestMedalId);
                      const highestMedalRank = highestMedalId ? medalRankMap[highestMedalId] : medalOrder.length;
                      const nextMedalRank = Math.max(0, highestMedalRank - 1);
                      const nextMedal = rewards.find(r => medalRankMap[r.id] === nextMedalRank);
                      const progressToNextMedal = nextMedal ? (user.totalPoints / nextMedal.cost) * 100 : (highestMedalRank === 0 ? 100 : 0);

                      return (
                        <Card key={user.id} className="flex flex-col relative">
                          <CardHeader className="flex flex-row items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.id}`} />
                                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-lg">{user.username}</p>
                                    {user.isAdmin && <ShieldCheck className="h-4 w-4 text-primary shrink-0" title="Admin User" />}
                                </div>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                              {highestMedal && (
                                <div className="shrink-0">
                                  <Image src={highestMedal.imageUrl} alt={highestMedal.name} width={40} height={40} title={highestMedal.name} />
                                </div>
                              )}
                          </CardHeader>
                          <CardContent className="flex-grow space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>Progress to {nextMedal?.name || 'Max'}</span>
                                  <span>{Math.floor(progressToNextMedal)}%</span>
                                </div>
                                <Progress value={progressToNextMedal} />
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <p className="font-headline text-2xl">{user.totalPoints}</p>
                                  <p className="text-xs text-muted-foreground">Total Points</p>
                                </div>
                                 <div>
                                  <p className="font-headline text-2xl">{user.maxLevel}</p>
                                  <p className="text-xs text-muted-foreground">Highest Level</p>
                                </div>
                              </div>
                          </CardContent>
                          <div className="p-4 pt-0">
                             <Button 
                                onClick={() => handleEditClick(user)} 
                                disabled={!isAdmin || isAdminLoading}
                                className="w-full"
                              >
                               <Edit className="mr-2 h-4 w-4" /> 
                                {isAdminLoading ? 'Checking...' : (isAdmin ? 'Manage User' : 'Admin Only')}
                            </Button>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChart/> New User Sign-ups (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analyticsData.dailySignups}>
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip wrapperClassName="!bg-popover !border-border" cursor={{fill: 'hsl(var(--muted))'}}/>
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                     {analyticsData.dailySignups.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChart /> User Distribution by Medal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                           <PieChart>
                                <Pie data={analyticsData.medalDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {analyticsData.medalDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={MEDAL_COLORS[entry.name as keyof typeof MEDAL_COLORS] || '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip wrapperClassName="!bg-popover !border-border" />
                                <Legend />
                           </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3/> Average Points per Topic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.topicAveragePoints} layout="vertical">
                                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80}/>
                                <Tooltip wrapperClassName="!bg-popover !border-border" cursor={{fill: 'hsl(var(--muted))'}}/>
                                <Bar dataKey="average" radius={[0, 4, 4, 0]}>
                                    {analyticsData.topicAveragePoints.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3/> Average Level per Topic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.topicAverageLevels} layout="vertical">
                                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80}/>
                                <Tooltip wrapperClassName="!bg-popover !border-border" cursor={{fill: 'hsl(var(--muted))'}}/>
                                <Bar dataKey="average" radius={[0, 4, 4, 0]}>
                                     {analyticsData.topicAverageLevels.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="info" className="mt-6">
          <InfoTabContent />
        </TabsContent>
      </Tabs>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.username}</DialogTitle>
            <CardDescription>
                Make changes to the user's profile, points, and medals.
            </CardDescription>
          </DialogHeader>
          {selectedUser && <EditUserForm user={selectedUser} onFinished={() => setIsEditDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}


export default function AdminDashboardPage() {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
       <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-2xl mx-auto">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have permission to view this page. This area is for authorized administrators only.</p>
        <Button asChild>
            <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Return to Home
            </Link>
        </Button>
      </div>
    )
  }

  return <AdminDashboard />;
}

    
