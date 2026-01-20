import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserDocument, UserData } from "@/services/userService";

export function useUserData() {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            if (!user) {
                setUserData(null);
                setLoading(false);
                return;
            }

            try {
                const data = await getUserDocument(user.uid);
                if (mounted) setUserData(data);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, [user]);

    return { userData, loading };
}
