import { EditProfileForm } from "@/components/editProfile";
import { getCurrentUser } from "@/api/auth"

export default async function EditProfilePage({ params }: { params: { id: string } }) {
    const result = await getCurrentUser();
    if (!result.success) {
        return (
            <div className="px-4 py-10 text-center text-muted-foreground">
                Couldn't load your profile.
            </div>
        );
    }

    return (
        <div>
            <EditProfileForm user={result.data} from="/profile" />
        </div>
    );
}