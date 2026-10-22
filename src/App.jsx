import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiDatabase,
  FiCheckCircle,
  FiHeadphones,
  FiMonitor,
  FiServer,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import {
  SiReact,
  SiJavascript,
  SiVite,
  SiHtml5,
  SiCss,
  SiPython,
  SiDjango,
  SiPhp,
  SiMariadb,
  SiNodedotjs,
  SiGit,
  SiGithub,
  SiJira,
  SiApple,
  SiPostgresql,
  SiTypescript,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiAstro,
  SiTailwindcss,
  SiNuxt,
  SiFastapi,
  SiExpress,
  SiNestjs,
  SiSpringboot,
  SiLaravel,
  SiMysql,
  SiRedis,
  SiMongodb,
  SiSqlite,
  SiDotnet,
  SiGithubactions,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiVercel,
  SiPostman,
  SiVitest,
  SiFigma,
  SiSentry,
  SiHostinger,
  SiGmail,
} from "react-icons/si";
import { FaAws, FaFileExcel, FaMicrosoft, FaWindows } from "react-icons/fa";
import Header from "./components/Header.jsx";
import DeviceShowcase from "./components/DeviceShowcase.jsx";
import FooterTransformation from "./components/FooterTransformation.jsx";
import { experience, projects } from "./data.js";

const stackGroups = [
  {
    heading: "Frontend",
    accent: "#087ea4",
    items: [
      [SiReact, "React", "#087ea4"],
      [SiJavascript, "JavaScript", "#9b7411"],
      [SiVite, "Vite", "#7c3aed"],
      [SiHtml5, "HTML", "#e34f26"],
      [SiCss, "CSS", "#1572b6"],
      [SiTypescript, "TypeScript", "#3178c6"],
      [SiNextdotjs, "Next.js", "#24292f"],
      [SiVuedotjs, "Vue.js", "#42b883"],
      [SiAngular, "Angular", "#dd0031"],
      [SiSvelte, "Svelte", "#ff3e00"],
      [SiAstro, "Astro", "#bc52ee"],
      [SiTailwindcss, "Tailwind CSS", "#06b6d4"],
      [SiNuxt, "Nuxt", "#00a76f"],
    ],
  },
  {
    heading: "Backend & data",
    accent: "#0f766e",
    items: [
      [SiPython, "Python", "#3776ab"],
      [SiDjango, "Django", "#0c6b4c"],
      [SiNodedotjs, "Node.js", "#398b3f"],
      [SiPhp, "PHP", "#686bb1"],
      [SiMariadb, "MariaDB", "#9a5b33"],
      [SiPostgresql, "PostgreSQL", "#336791"],
      [FiDatabase, "SQL", "#9a5b33"],
      [SiFastapi, "FastAPI", "#009688"],
      [SiExpress, "Express", "#404040"],
      [SiNestjs, "NestJS", "#e0234e"],
      [SiSpringboot, "Spring Boot", "#6db33f"],
      [SiLaravel, "Laravel", "#ff2d20"],
      [SiDotnet, "ASP.NET Core", "#512bd4"],
      [SiMysql, "MySQL", "#00758f"],
      [SiRedis, "Redis", "#dc382d"],
      [SiMongodb, "MongoDB", "#47a248"],
      [SiSqlite, "SQLite", "#0f80cc"],
    ],
  },
  {
    heading: "Workflow and Delivery",
    accent: "#7c3aed",
    items: [
      [SiGit, "Git", "#e84d31"],
      [SiGithub, "GitHub", "#24292f"],
      [SiGithubactions, "GitHub Actions", "#2088ff"],
      [SiDocker, "Docker", "#2496ed"],
      [SiKubernetes, "Kubernetes", "#326ce5"],
      [FaAws, "AWS", "#ff9900"],
      [SiTerraform, "Terraform", "#7b42bc"],
      [SiVercel, "Vercel", "#24292f"],
      [SiPostman, "Postman", "#ff6c37"],
      [FiCheckCircle, "Playwright", "#2e8b57"],
      [SiVitest, "Vitest", "#7fbf3f"],
      [SiFigma, "Figma", "#f24e1e"],
    ],
  },
  {
    heading: "Misc & IT support",
    accent: "#c3772b",
    items: [
      [FaMicrosoft, "Office 365", "#d83b01"],
      [FiUsers, "Active Directory", "#6554c0"],
      [FiShield, "VPN", "#0f766e"],
      [FiServer, "DHCP", "#1d6bc1"],
      [FiHeadphones, "Application Support", "#ab4f75"],
      [FiMonitor, "Remote Troubleshooting", "#087ea4"],
      [FiCreditCard, "PayMongo", "#635bff"],
      [FaFileExcel, "Excel Automations", "#217346"],
      [SiJira, "Jira", "#0052cc"],
      [FaWindows, "Windows", "#0078d4"],
      [SiApple, "macOS", "#555d66"],
    ],
  },
];

const projectStackIcons = {
  React: SiReact,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss,
  Vite: SiVite,
  PHP: SiPhp,
  MariaDB: SiMariadb,
  PHPMailer: FiMail,
  Sentry: SiSentry,
  "GitHub Actions": SiGithubactions,
  Hostinger: SiHostinger,
  "Z.com": FiServer,
  Python: SiPython,
  Django: SiDjango,
  PostgreSQL: SiPostgresql,
  "Gmail SMTP": SiGmail,
  Vercel: SiVercel,
};

const projectGroups = [
  { id: "client-projects", title: "Client Projects", type: "client" },
  {
    id: "self-initiative-projects",
    title: "Self-Initiative Projects",
    type: "self",
  },
];

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>;
}

function ExperienceTimeline() {
  const timelineRef = useRef(null);
  const [revealed, setRevealed] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (revealed || !timelineRef.current) return undefined;

    const timeline = timelineRef.current;
    const revealIfReached = () => {
      const rect = timeline.getBoundingClientRect();
      if (rect.height > 0 && rect.top <= window.innerHeight * 0.9) {
        setRevealed(true);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(timeline);
    window.addEventListener("scroll", revealIfReached, { passive: true });
    window.addEventListener("resize", revealIfReached);
    revealIfReached();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealIfReached);
      window.removeEventListener("resize", revealIfReached);
    };
  }, [revealed]);

  return (
    <ul
      ref={timelineRef}
      className={`experience ${revealed ? "is-revealed" : "is-pending"}`}
      aria-label="Selected professional experience"
    >
      {experience.map((item, index) => (
        <li
          className={`experience__row experience__row--from-${index % 2 === 0 ? "left" : "right"}${item.featured ? " experience__row--featured" : ""}`}
          key={item.role}
          style={{ "--experience-delay": `${index * 120}ms` }}
        >
          <span className="experience__date">{item.date}</span>
          <h3 className="experience__role">{item.role}</h3>
          {item.company && (
            <span className="experience__company">{item.company}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function StackGroup({ group }) {
  const groupRef = useRef(null);
  const [revealed, setRevealed] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (revealed || !groupRef.current) return undefined;

    const group = groupRef.current;
    const revealIfReached = () => {
      const rect = group.getBoundingClientRect();
      if (rect.height > 0 && rect.top <= window.innerHeight * 0.9) {
        setRevealed(true);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(group);
    window.addEventListener("scroll", revealIfReached, { passive: true });
    window.addEventListener("resize", revealIfReached);
    revealIfReached();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealIfReached);
      window.removeEventListener("resize", revealIfReached);
    };
  }, [revealed]);

  return (
    <div
      ref={groupRef}
      className={`stack__group ${revealed ? "is-revealed" : "is-pending"}`}
      style={{ "--group-accent": group.accent }}
    >
      <div className="stack__group-title">
        <h3>{group.heading}</h3>
      </div>
      <ul className="stack__items">
        {group.items.map(([Icon, label, color], index) => (
          <li
            className="stack__item"
            key={label}
            style={{
              "--icon-color": color,
              "--drop-index": index,
              "--drop-row": Math.floor(index / 2),
            }}
          >
            <span className="stack__icon" aria-hidden="true">
              <Icon />
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [revealed, setRevealed] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (revealed || !cardRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <article
      ref={cardRef}
      className={`project-card ${revealed ? "is-revealed" : "is-pending"}`}
      style={{ "--reveal-delay": `${index * 110}ms` }}
    >
      <a
        className="project-card__visual"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.title} (opens in a new tab)`}
      >
        <img
          src={project.image}
          alt=""
          loading="lazy"
          width="1280"
          height="720"
        />
      </a>
      <div className="project-card__details">
        <div className="project-card__meta">
          <span>{project.category}</span>
        </div>
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        <div
          className="project-card__tags"
          aria-label="Technologies and hosting"
        >
          {project.stack.map((item) => {
            const Icon = projectStackIcons[item];
            return (
              <span key={item}>
                {Icon && <Icon aria-hidden="true" />}
                {item}
              </span>
            );
          })}
        </div>
        <a
          className="project-card__cta"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} in a new tab`}
        >
          <span>View project</span>
          <span className="project-card__cta-icon">
            <FiArrowUpRight aria-hidden="true" />
          </span>
        </a>
      </div>
    </article>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section
          className="hero section-shell"
          id="top"
          aria-labelledby="hero-title"
        >
          <div className="hero__grid">
            <div className="hero__copy">
              <h1 id="hero-title">
                Building what <em>works.</em>
                <br />
                Supporting what <span>matters.</span>
              </h1>
              <p className="hero__intro">
                I’m Michael John Ojoy. I build practical digital experiences and
                bring clarity to complex technical problems.
              </p>
              <div className="hero__actions">
                <a className="button button--dark" href="#projects">
                  Explore my work <FiArrowUpRight aria-hidden="true" />
                </a>
                <a className="button button--text" href="#contact">
                  Let’s connect <FiArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
            <DeviceShowcase />
          </div>
          <a className="hero__scroll" href="#about">
            <span className="hero__scroll-mouse" aria-hidden="true">
              <span className="hero__scroll-wheel" />
            </span>
            <span>Scroll for more</span>
          </a>
        </section>

        <section
          className="about section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <SectionLabel>About</SectionLabel>
          <div className="about__grid">
            <div>
              <h2 id="about-title">
                A bridge between <span>people</span> and technology.
              </h2>
            </div>
            <div className="about__body">
              <p>
                I’m a software developer and technical support professional with
                more than seven years of experience across enterprise support,
                application troubleshooting, and development collaboration.
              </p>
              <p>
                My work has ranged from helping users and investigating
                production issues to building web tools that make everyday
                processes easier. I’m at my best when a problem needs both
                technical depth and a clear, human response.
              </p>
              <a className="inline-link" href="#contact">
                More about working together{" "}
                <FiArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <ExperienceTimeline />
        </section>

        <section
          className="projects section-shell"
          id="projects"
          aria-labelledby="projects-title"
        >
          <SectionLabel>Selected projects</SectionLabel>
          <div className="section-heading">
            <h2 id="projects-title">
              Work with <em>purpose.</em>
            </h2>
            <p>
              Real projects shaped by practical needs: clear interfaces,
              dependable systems, and easier workflows.
            </p>
          </div>
          {projectGroups.map(({ id, title, type }) => (
            <section className="projects__group" key={id} aria-labelledby={id}>
              <h3 className="projects__group-title" id={id}>
                {title}
              </h3>
              <div className="projects__grid">
                {projects
                  .filter((project) => project.type === type)
                  .map((project, index) => (
                    <ProjectCard
                      key={project.title}
                      project={project}
                      index={index}
                    />
                  ))}
              </div>
            </section>
          ))}
        </section>

        <section
          className="stack section-shell"
          id="tech-stack"
          aria-labelledby="stack-title"
        >
          <SectionLabel>Tech stack</SectionLabel>
          <div className="section-heading">
            <h2 id="stack-title">
              Tools of the <em>trade.</em>
            </h2>
            <p>
              Technologies across development, delivery, and day-to-day support.
            </p>
          </div>
          <div className="stack__grid">
            {stackGroups.map((group) => (
              <StackGroup key={group.heading} group={group} />
            ))}
          </div>
        </section>

        <section
          className="contact section-shell"
          id="contact"
          aria-labelledby="contact-title"
        >
          <SectionLabel>Contact</SectionLabel>
          <div className="contact__grid">
            <div>
              <p className="contact__pretitle">
                HAVE A PROJECT OR ROLE IN MIND?
              </p>
              <h2 id="contact-title">
                Let’s make it <em>work.</em>
              </h2>
              <p>
                Whether you need a developer, a technical support professional,
                or someone who understands both, I’d be glad to talk.
              </p>
            </div>
            <div className="contact__details">
              <div>
                <FiMail
                  className="contact__icon contact__icon--email"
                  aria-hidden="true"
                />
                <span>michaeljohnojoy26@gmail.com</span>
              </div>
              <a
                href="https://www.linkedin.com/in/michael-john-ojoy-11b13116b"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className="contact__social-icon contact__icon--linkedin"
                  aria-hidden="true"
                >
                  in
                </span>
                <span>Connect on LinkedIn</span>
                <FiArrowUpRight aria-hidden="true" />
              </a>
              <div>
                <FiMapPin
                  className="contact__icon contact__icon--location"
                  aria-hidden="true"
                />
                <span>Binangonan, Rizal, Philippines</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer section-shell">
        <p className="footer__quote">
          <strong>Truth</strong> is the most beautiful thing to ever exist.
        </p>
        <FooterTransformation />
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </>
  );
}
