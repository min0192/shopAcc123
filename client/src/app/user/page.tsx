import { Suspense } from "react";
import UserProfilePage from "../../components/user/UserProfilePage";

export default function Page() {
  return (
    <Suspense>
      <UserProfilePage />
    </Suspense>
  );
}
