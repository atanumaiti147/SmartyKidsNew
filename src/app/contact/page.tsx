
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <Card className="shadow-xl rounded-[20px] border-2">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary rounded-full p-4 w-fit mb-4">
             <Mail className="h-12 w-12 text-primary-foreground" />
          </div>
          <CardTitle className="font-headline text-4xl md:text-5xl font-bold">
            Contact Us
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            We&apos;d love to hear from you!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Have a question, feedback, or need support? The best way to reach us is by email. Click the button below to send us a message, and our team will get back to you as soon as possible.
          </p>
          <div className="space-y-2">
             <h4 className="font-semibold text-lg">Support Email</h4>
             <p className="text-muted-foreground">support@smartykids.qzz.io</p>
          </div>
          <Button asChild size="lg" className="font-bold text-lg">
            <a href="mailto:support@smartykids.qzz.io">
              <Mail className="mr-2" /> Send Email
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
