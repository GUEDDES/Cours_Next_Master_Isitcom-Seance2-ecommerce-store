import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Erreur de configuration de l'authentification.",
  AccessDenied: "Acces refuse pour cette authentification.",
  Verification: "Le lien de verification est invalide ou expire.",
  CredentialsSignin: "Email ou mot de passe invalide.",
  OAuthSignin: "Impossible de lancer la connexion OAuth.",
  OAuthCallback: "Erreur lors du retour OAuth.",
  OAuthAccountNotLinked:
    "Ce compte email est deja lie a un autre fournisseur.",
  Default: "Une erreur d'authentification est survenue.",
};

interface AuthErrorPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const errorCode = resolvedSearchParams.error || "Default";
  const message = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Erreur d&apos;authentification
        </h1>

        <p className="mb-3 text-gray-700">{message}</p>
        <p className="mb-6 text-sm text-gray-500">Code: {errorCode}</p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth/login"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retour a la connexion
          </Link>
          <Link
            href="/"
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
