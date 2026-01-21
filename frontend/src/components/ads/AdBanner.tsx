import { useEffect } from 'react';

interface AdBannerProps {
    challenge?: { isPaid: boolean };
}

export function AdBanner({ challenge }: AdBannerProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    if (challenge?.isPaid) return null;

    return (
        <div className="w-full flex justify-center py-4 bg-muted/20">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9811695349836486"
                data-ad-slot="7145238014"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
