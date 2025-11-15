import { prisma } from "@/lib/prisma";
import { setPasswordAction } from "@/actions/set-password.actions";

export default async function CreatePasswordPage({ searchParams }: any) {
  const token = searchParams.token;

  if (!token) {
    return <p className="text-red-500">Invalid or missing token.</p>;
  }

  // Check if token exists & valid
  const invite = await prisma.inviteToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!invite || invite.expiresAt < new Date()) {
    return <p className="text-red-500">Token expired or invalid.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 border p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4">Set Your Password</h1>

      <form action={setPasswordAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        <input
          type="password"
          name="password"
          placeholder="New password"
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Set Password
        </button>
      </form>
    </div>
  );
}
