import React from "react";
import Link from "next/link";
import { LAPTOP_LOGO_SVG } from "@/lib/assets";
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
import { Icon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer>
      <div className="foot-top">
        <div className="foot-brand">
          <img
            className="foot-logo"
            src={LAPTOP_LOGO_SVG}
            alt="Coding laptop logo"
            width={54}
            height={54}
          />
          <div>
            <div className="foot-name">Waleed Khokhar</div>
            <div className="foot-role">Full-Stack AI Engineer</div>
          </div>
        </div>
        <h3 className="foot-headline">
          Learn &amp; Contribute Practical Skills to Get Better Opportunities
        </h3>
        <p className="foot-tag">
          Start from zero. Become job-ready. Free forever, open source, built for learners.
        </p>
        <div className="foot-startrow">
          <p className="foot-start-note">&#11088; Start must, first of all.</p>
          <a
            className="btn btn-green"
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            &#11088; Start the Repo
          </a>
        </div>
      </div>

      <div className="foot-links">
        <h4>Quick Links</h4>
        <div className="foot-qlinks">
          <Link href="/">Home</Link>
          <Link href="/courses">All 10 Courses</Link>
          <Link href="/story">My Story / About Us</Link>
          <Link href="/contribute">Contribute</Link>
          <Link href="/course/1">Start Course 1 &mdash; Python</Link>
        </div>
      </div>

      <div className="foot-detail">
        <h4>Connect With Me</h4>
        <p className="fd-sub">
          Open to work and freelance. All eight ways to reach me, each with its official icon and full handle &mdash; tap any card to open it.
        </p>
        <div className="fd-grid">
          <a className="fd-card" href={PROFILE} target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/github.svg" alt="GitHub" />
            <span>
              <span className="fd-t">GitHub</span>
              <br />
              <span className="fd-d">
                github.com/<wbr />waleedkhokar
              </span>
            </span>
          </a>

          <a className="fd-card" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/linkedin.svg" alt="LinkedIn" />
            <span>
              <span className="fd-t">LinkedIn</span>
              <br />
              <span className="fd-d">
                linkedin.com/in/<wbr />waleedkhokhar
              </span>
            </span>
          </a>

          <a className="fd-card" href={PORTFOLIO} target="_blank" rel="noopener noreferrer">
            <Icon name="portfolio" />
            <span>
              <span className="fd-t">Portfolio</span>
              <br />
              <span className="fd-d">waledkhokar.vercel.app</span>
            </span>
          </a>

          <a className="fd-card" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/whatsapp.svg" alt="WhatsApp" />
            <span>
              <span className="fd-t">WhatsApp</span>
              <br />
              <span className="fd-d">0319 1402404</span>
            </span>
          </a>

          <a className="fd-card" href={WA_GROUP} target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/whatsapp.svg" alt="WhatsApp Group" />
            <span>
              <span className="fd-t">WhatsApp Group</span>
              <br />
              <span className="fd-d">
                chat.whatsapp.com/<wbr />KE1BXNx38zbE82PYHKDjLu
              </span>
            </span>
          </a>

          <a className="fd-card" href={FACEBOOK} target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/facebook.svg" alt="Facebook" />
            <span>
              <span className="fd-t">Facebook</span>
              <br />
              <span className="fd-d">
                facebook.com/<wbr />waleedkhokharr
              </span>
            </span>
          </a>

          <a className="fd-card" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/instagram.svg" alt="Instagram" />
            <span>
              <span className="fd-t">Instagram</span>
              <br />
              <span className="fd-d">
                instagram.com/<wbr />waled_khokar
              </span>
            </span>
          </a>

          <a className="fd-card" href={`mailto:${GMAIL}`}>
            <img src="/assets/icons/gmail.svg" alt="Gmail" />
            <span>
              <span className="fd-t">Gmail</span>
              <br />
              <span className="fd-d">
                waleedkhokharbusiness@<wbr />gmail.com
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="foot-base">
        &copy; Python AI Engineering Journey by Waleed Khokhar. Free forever. Open source. First of all, start the repo &mdash; start is a must.
      </div>
    </footer>
  );
}
