import React from "react";
import { Icon } from "@/components/ui/Icons";
import {
  REPO,
  PROFILE,
  LINKEDIN,
  PORTFOLIO,
  WHATSAPP,
  WA_GROUP,
  FACEBOOK,
  INSTAGRAM,
  GMAIL,
} from "@/lib/data";

function BrandCard({
  slug,
  title,
  desc,
  url,
  label,
  action,
  isEmail = false,
}: {
  slug?: string;
  title: string;
  desc: string;
  url: string;
  label: string;
  action: string;
  isEmail?: boolean;
}) {
  return (
    <div className="ccard">
      <div className="micon">
        {slug ? (
          <img src={`/assets/icons/${slug}.svg`} alt="" loading="lazy" />
        ) : (
          <Icon name="briefcase" />
        )}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <a
          className="url"
          href={isEmail ? `mailto:${url}` : url}
          target={isEmail ? undefined : "_blank"}
          rel={isEmail ? undefined : "noopener noreferrer"}
        >
          {label}
        </a>
        <br />
        <a
          className="mini-link"
          href={isEmail ? `mailto:${url}` : url}
          target={isEmail ? undefined : "_blank"}
          rel={isEmail ? undefined : "noopener noreferrer"}
          style={{ marginTop: "10px" }}
        >
          {action} <Icon name="ext" />
        </a>
      </div>
    </div>
  );
}

export default function ConnectGrid() {
  return (
    <section className="panel rv">
      <div className="sec-head">
        <h2>Connect With Me</h2>
        <p>Open to work and freelance &mdash; reach me or follow my work on any of these:</p>
      </div>
      <div className="connect-grid">
        <BrandCard
          slug="github"
          title="GitHub"
          desc="All my code and open-source work &mdash; 20+ projects and counting."
          url={PROFILE}
          label="github.com/waleedkhokar"
          action="Open GitHub"
        />
        <BrandCard
          slug="linkedin"
          title="LinkedIn"
          desc="Connect with me professionally &mdash; experience, posts and updates."
          url={LINKEDIN}
          label="linkedin.com/in/waleedkhokhar"
          action="Open LinkedIn"
        />
        <BrandCard
          title="Portfolio"
          desc="My work, projects and services &mdash; everything I build, in one place."
          url={PORTFOLIO}
          label="waledkhokar.vercel.app"
          action="Open Portfolio"
        />
        <BrandCard
          slug="whatsapp"
          title="WhatsApp"
          desc="Message me directly &mdash; the fastest way to reach me."
          url={WHATSAPP}
          label="0319 1402404"
          action="Open WhatsApp"
        />
        <BrandCard
          slug="whatsapp"
          title="WhatsApp Group"
          desc="Join the community group &mdash; 50+ developers learning and building together."
          url={WA_GROUP}
          label="chat.whatsapp.com &mdash; group invite"
          action="Join the Group"
        />
        <BrandCard
          slug="facebook"
          title="Facebook"
          desc="Follow my page for updates, posts and community news."
          url={FACEBOOK}
          label="facebook.com/waleedkhokharr"
          action="Open Facebook"
        />
        <BrandCard
          slug="instagram"
          title="Instagram"
          desc="Behind the scenes &mdash; my work, my journey and daily progress."
          url={INSTAGRAM}
          label="instagram.com/waled_khokar"
          action="Open Instagram"
        />
        <BrandCard
          slug="gmail"
          title="Gmail"
          desc="For work, freelance projects and collaborations &mdash; email me any time."
          url={GMAIL}
          label={GMAIL}
          action="Send an Email"
          isEmail
        />
      </div>
    </section>
  );
}
