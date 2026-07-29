"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyCard from "@/components/CompanyCard";
import type { Company } from "@/lib/companies";

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

  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "example";

  const previewCompany: Company = {
    name: formData.name || "Acme Tech",
    slug: slug,
    website: formData.website || "https://example.com",
    careers: formData.careers || "https://example.com/careers",
    country: formData.country || "United States",
    region: formData.region,
    category: formData.category,
    hiringType: formData.hiringType.length > 0 ? formData.hiringType : ["Full-time"],
    description:
      formData.description ||
      "Acme Tech is building next-generation infrastructure tools for cloud native software teams worldwide.",
    logo: formData.website ? `https://logo.clearbit.com/${new URL(formData.website.startsWith("http") ? formData.website : `https://${formData.website}`).hostname}` : "https://logo.clearbit.com/example.com",
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
    if (!formData.name || !formData.website || !formData.careers) return;
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
              fontFamily: "'Playfair Display', Georgia, serif",
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
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              Submission Received!
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Thank you for contributing <strong>{formData.name}</strong>. Our team will verify the official careers URL and list it shortly.
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

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                type="button"
                onClick={copyJson}
                style={{
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2.5rem",
              alignItems: "start",
            }}
          >
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
                  fontFamily: "'Playfair Display', Georgia, serif",
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                            background: active ? "rgba(79,70,229,0.1)" : "var(--bg-primary)",
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
                    boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
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
