import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import LegalLayout from "../components/legal-layout";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacyPage");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default function PrivacyPage() {
  const t = useTranslations("privacyPage");
  return (
    <LegalLayout title={t("layoutTitle")} updated={t("updated")}>
      <div className="callout">
        <p>{t("callout")}</p>
      </div>

      <h2>{t("websiteHeading")}</h2>
      <p>{t("websiteStatic")}</p>
      <p>
        {t.rich("websiteHosting", {
          vercel: (chunks) => (
            <a href="https://vercel.com" target="_blank" rel="noreferrer">
              {chunks}
            </a>
          ),
          vercelPrivacy: (chunks) => (
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <h2>{t("desktopHeading")}</h2>
      <p>{t("desktopIntro")}</p>
      <ul>
        {(t.raw("desktopPoints") as string[]).map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
      <p>{t("desktopDisclaimer")}</p>

      <h2>{t("demoHeading")}</h2>
      <p>{t("demoBody")}</p>

      <h2>{t("thirdPartyHeading")}</h2>
      <p>
        {t.rich("thirdPartyBody", {
          unsplash: (chunks) => (
            <a
              href="https://unsplash.com/photos/green-trees-near-mountain-under-white-clouds-and-blue-sky-during-daytime-oMpAz-DN-9I"
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <h2>{t("changesHeading")}</h2>
      <p>{t("changesBody")}</p>

      <h2>{t("contactHeading")}</h2>
      <p>
        {t.rich("contactBody", {
          github: (chunks) => (
            <a
              href="https://github.com/viincnt/Transfert"
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </LegalLayout>
  );
}
