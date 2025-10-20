import { useEffect } from "react";

/**
 * Seo component (no external deps). Call at top of page components.
 * Example: <Seo title="Home" description="..." url="/teams" />
 */
export default function Seo({ title, description, url, image, keywords }) {
  useEffect(() => {
    const base = "https://esport-x-frontend.vercel.app";
    if (title) document.title = `${title} | Esport-X`;
    if (description) setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    if (url) setLink("canonical", base + url);
    if (image) setMeta("og:image", image, "property");
    setMeta("og:title", title || "Esport-X", "property");
    setMeta("og:description", description || "Esport-X", "property");
    setMeta("og:url", base + (url || "/"), "property");
    setMeta("twitter:card", "summary_large_image");
    return () => {};
  }, [title, description, url, image, keywords]);

  return null;

  function setMeta(name, content, attr = "name") {
    if (!content) return;
    const selector = `${attr}="${name}"`;
    let el = document.head.querySelector(`meta[${selector}]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setLink(rel, href) {
    if (!href) return;
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }
}