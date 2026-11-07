import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import LegalLayout from "../components/legal-layout";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("termsPage");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default function TermsPage() {
  const t = useTranslations("termsPage");
  return (
    <LegalLayout title={t("layoutTitle")} updated={t("updated")}>
      <p>{t("intro")}</p>

      <h2>{t("websiteHeading")}</h2>
      <p>{t("websiteInformational")}</p>
      <p>{t("websiteGoodFaith")}</p>

      <h2>{t("desktopHeading")}</h2>
      <p>
        {t.rich("desktopBody", {
          mit: (chunks) => (
            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
          apache: (chunks) => (
            <a
              href="https://www.apache.org/licenses/LICENSE-2.0"
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <p>{t("desktopOpenSource")}</p>

      <h2>{t("warrantyHeading")}</h2>
      <p>{t("warrantyBody")}</p>

      <h2>{t("ipHeading")}</h2>
      <p>
        {t.rich("ipBody", {
          unsplash: (chunks) => (
            <a href="https://unsplash.com" target="_blank" rel="noreferrer">
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
