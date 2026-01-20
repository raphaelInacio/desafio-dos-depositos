import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReferralCardProps {
    referralCode: string;
    className?: string;
    hasAvailableReward?: boolean;
}

export function ReferralCard({ referralCode, className, hasAvailableReward }: ReferralCardProps) {
    const { toast } = useToast();
    const inviteLink = `${window.location.origin}/register?ref=${referralCode}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            toast({
                title: "Link copied!",
                description: "Share it with your friends.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Failed to copy",
                description: "Please copy the link manually.",
            });
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join me on Desafio dos Depósitos",
                    text: "Let's save money together! Use my referral code to get started.",
                    url: inviteLink,
                });
            } catch (err) {
                // User cancelled or share failed, fallback to copy
                if ((err as Error).name !== 'AbortError') handleCopy();
            }
        } else {
            handleCopy();
        }
    };

    return (
        <Card className={`${className} sm:col-span-2 overflow-hidden border-2 ${hasAvailableReward ? 'border-yellow-400' : 'border-dashed'}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Invite Friends
                    </CardTitle>
                    {hasAvailableReward && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            Free Challenge Available!
                        </span>
                    )}
                </div>
                <CardDescription>
                    Invite a friend. When they start their first challenge, you get <strong>1 free challenge</strong> (no ads!).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-2">
                    <Input
                        value={inviteLink}
                        readOnly
                        className="font-mono text-sm bg-muted"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
