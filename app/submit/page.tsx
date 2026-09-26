"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyCard from "@/components/CompanyCard";
import {
  getCompanyBySlug,
  isHttpUrl,
  logoFromWebsite,
  slugifyCompanyName,
  type Company,
} from "@/lib/companies";
import { getSubmissions, saveSubmission } from "@/lib/submissions";

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    careers: "",
    country: "United States",
    region: "US" as Company["region"],
    category: "Startup" as Company["category"],
    hiringType: ["Full-time"] as Array<"Full-time" | "Internships" | "Remote-friendly">,
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const slug = slugifyCompanyName(formData.name) || "example";

  const previewCompany: Company = {
    name: formData.name || "Acme Tech",
    slug,
    website: isHttpUrl(formData.website) ? formData.website : "https://example.com",
    careers: isHttpUrl(formData.careers) ? formData.careers : "https://example.com/careers",
    country: formData.country || "United States",
    region: formData.region,
    category: formData.category,
    hiringType: formData.hiringType.length > 0 ? formData.hiringType : ["Full-time"],
    description:
      formData.description ||
      "Acme Tech is building next-generation infrastructure tools for cloud native software teams worldwide.",
    logo: logoFromWebsite(formData.website),
  };

  const handleHiringToggle = (type: "Full-time" | "Internships" | "Remote-friendly") => {
    setFormData((prev) => {
      const exists = prev.hiringType.includes(type);
      return {
        ...prev,
        hiringType: exists
          ? prev.hiringType.filter((t) => t !== type)
          : [...prev.hiringType, type],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSlug = slugifyCompanyName(formData.name);
    if (!nextSlug) {
      setError("Company name needs at least one letter or number.");
      return;
    }
    if (!isHttpUrl(formData.website) || !isHttpUrl(formData.careers)) {
      setError("Website and careers page both need a full http or https URL.");
      return;
    }
    if (!formData.country.trim()) {
      setError("Add the headquarters country.");
      return;
    }
    if (formData.description.trim().length < 20) {
      setError("Add a short description of at least 20 characters.");
      return;
    }
    if (formData.hiringType.length === 0) {
      setError("Choose at least one hiring type.");
      return;
    }
    if (getCompanyBySlug(nextSlug) || getSubmissions()[nextSlug]) {
      setError("A company with this name is already in the directory.");
      return;
    }

    const company: Company = {
      name: formData.name.trim(),
      slug: nextSlug,
      website: formData.website.trim(),
      careers: formData.careers.trim(),
      country: formData.country.trim(),
      region: formData.region,
      category: formData.category,
      hiringType: formData.hiringType,
      description: formData.description.trim(),
      logo: logoFromWebsite(formData.website),
    };

    saveSubmission(company);
    setError("");
    setSubmitted(true);
  };

  const jsonSubmission = JSON.stringify(previewCompany, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonSubmission);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.75rem",
            }}
          >
            Open Careers Directory
          </p>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            Submit a Company to JustApply
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Know a great tech company hiring software developers? Submit its details below to feature it in our public directory.
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "2.5rem",
              textAlign: "center",
              boxShadow: "0 8px 30px var(--shadow-md)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#D1FAE5",
                color: "#065F46",
                fontSize: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              {formData.name} is in your directory
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              <strong>{formData.name}</strong> is saved in this browser and now appears when you browse, filter, and track companies on this device.
            </p>

            <div
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "left",
                marginBottom: "1.5rem",
                maxHeight: "180px",
                overflowY: "auto",
              }}
            >
              <pre style={{ fontSize: "0.78rem", fontFamily: "monospace", margin: 0 }}>
                {jsonSubmission}
              </pre>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/company/${slugifyCompanyName(formData.name)}`}
                style={{
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                View company page
              </Link>
              <button
                type="button"
                onClick={copyJson}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                {copied ? "Copied JSON ✓" : "Copy JSON Data"}
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          <div className="submit-layout">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 20px var(--shadow)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Company Information
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label
                    htmlFor="name"
                    style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                  >
                    Company Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Stripe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      background: "var(--bg-primary)",
                      outline: "none",
                    }}
                  />
                </div>

                <div className="form-row">
                  <div>
                    <label
                      htmlFor="website"
                      style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                    >
                      Website URL *
                    </label>
                    <input
                      id="website"
                      type="url"
                      required
                      placeholder="https://stripe.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "var(--bg-primary)",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="careers"
                      style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                    >
                      Careers Page URL *
                    </label>
                    <input
                      id="careers"
                      type="url"
                      required
                      placeholder="https://stripe.com/jobs"
                      value={formData.careers}
                      onChange={(e) => setFormData({ ...formData, careers: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "var(--bg-primary)",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label
                      htmlFor="region"
                      style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                    >
                      Primary Region
                    </label>
                    <select
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value as Company["region"] })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "var(--bg-primary)",
                        outline: "none",
                      }}
                    >
                      <option value="US">United States</option>
                      <option value="India">India</option>
                      <option value="Europe">Europe</option>
                      <option value="Remote">Remote-first</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Company["category"] })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "var(--bg-primary)",
                        outline: "none",
                      }}
                    >
                      <option value="Startup">Startup</option>
                      <option value="Fintech">Fintech</option>
                      <option value="AI">AI</option>
                      <option value="SaaS">SaaS</option>
                      <option value="DevTools">DevTools</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Web3">Web3</option>
                      <option value="MNC">MNC</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                  >
                    Headquarters Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="e.g. United States or India"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      background: "var(--bg-primary)",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                  >
                    Hiring Types
                  </label>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {(["Full-time", "Internships", "Remote-friendly"] as const).map((type) => {
                      const active = formData.hiringType.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleHiringToggle(type)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            border: active ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                            background: active ? "var(--accent-soft)" : "var(--bg-primary)",
                            color: active ? "var(--accent)" : "var(--text-secondary)",
                            cursor: "pointer",
                          }}
                        >
                          {active ? "✓ " : "+ "}{type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}
                  >
                    Short Description (1-2 sentences)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Brief summary of what the company does..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      background: "var(--bg-primary)",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {error && (
                  <p role="alert" style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: 1.5 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  style={{
                    marginTop: "0.5rem",
                    padding: "12px 24px",
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px var(--accent-glow)",
                  }}
                >
                  Submit Company
                </button>
              </div>
            </form>

            {/* Live Preview */}
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "1rem",
                }}
              >
                Live Directory Preview
              </p>
              <div style={{ height: "340px" }}>
                <CompanyCard company={previewCompany} />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
