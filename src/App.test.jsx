import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  delete navigator.clipboard;
  localStorage.removeItem("portfolio-theme");
  delete document.documentElement.dataset.theme;
});

describe("color theme", () => {
  it("switches both ways and keeps the chosen theme after remounting", () => {
    document.documentElement.dataset.theme = "light";
    const page = render(<App />);
    const darkButton = screen.getByRole("button", {
      name: "Switch to dark mode",
    });

    fireEvent.click(darkButton);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("portfolio-theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();

    page.unmount();
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to light mode" }),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(localStorage.getItem("portfolio-theme")).toBe("light");
  });

  it("follows the system preference until a manual choice is saved", () => {
    delete document.documentElement.dataset.theme;
    let onChange;
    vi.stubGlobal("matchMedia", (query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      addEventListener: (_, callback) => {
        if (query === "(prefers-color-scheme: dark)") onChange = callback;
      },
      removeEventListener: () => {},
    }));
    render(<App />);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    act(() => onChange({ matches: false }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );
    act(() => onChange({ matches: false }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});

describe("portfolio navigation", () => {
  it("points each main navigation item to an existing section", () => {
    const { container } = render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    const links = [...nav.querySelectorAll("a")];
    expect(links.map((link) => link.textContent)).toEqual([
      "ABOUT",
      "PROJECTS",
      "TECH STACK",
      "CONTACT ME",
    ]);
    for (const link of links) {
      expect(
        container.querySelector(link.getAttribute("href")),
      ).toBeInTheDocument();
    }
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /From complex problems\s*to working products\./,
    );
    expect(container.querySelector(".hero__intro")).toHaveTextContent(
      "I build clear, reliable websites and business tools—and help people use technology with confidence.",
    );
    expect(
      screen.getByRole("link", { name: "Scroll for more" }),
    ).toHaveAttribute("href", "#about");
    expect(
      [...container.querySelectorAll(".section-label")].map(
        (label) => label.textContent,
      ),
    ).toEqual([
      "About",
      "Services",
      "Selected projects",
      "Tech stack",
      "Contact",
    ]);
    expect(
      screen.queryByText("OPEN TO NEW OPPORTUNITIES"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("BASED IN RIZAL, PHILIPPINES"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("SOFTWARE DEVELOPMENT / TECHNICAL SUPPORT"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Two disciplines.")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Desktop monitor, laptop, and phone rising upright",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Luffy transforming into Gear 5" }),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".footer__transformation-gif"),
    ).toHaveAttribute("src", "/footer/luffy-gear5.gif");
    expect(container.querySelector(".footer__quote").textContent.trim()).toBe(
      "Truth is the most beautiful thing to ever exist.",
    );
    expect(
      screen.queryByText("SOFTWARE DEVELOPMENT × TECHNICAL SUPPORT"),
    ).not.toBeInTheDocument();
  });

  it("exposes real project and contact destinations", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll(".project-card a")).toHaveLength(8);
    const sections = [...container.querySelectorAll(".projects__group")];
    const projectMeta = [...container.querySelectorAll(".project-card__meta")];
    expect(projectMeta.map((meta) => meta.textContent.trim())).toEqual([
      "Booking platform",
      "Website & catalogue",
      "Company website & CMS",
      "Retail point of sale",
    ]);
    expect(
      projectMeta.every((meta) => meta.querySelector("svg") === null),
    ).toBe(true);
    expect(
      sections.map((section) => section.querySelector("h3").textContent),
    ).toEqual(["Client Projects", "Self-Initiative Projects"]);
    expect(
      [...sections[0].querySelectorAll(".project-card h4")].map(
        (heading) => heading.textContent,
      ),
    ).toEqual(["MIXAIAS Booking System", "NYC Ragdoll Kittens", "RGT Website"]);
    expect(sections[1].querySelector(".project-card h4")).toHaveTextContent(
      "OXPOS",
    );
    const tagGroups = [...container.querySelectorAll(".project-card__tags")];
    expect(tagGroups.map((group) => group.getAttribute("aria-label"))).toEqual(
      Array(4).fill("Technologies and hosting"),
    );
    expect(
      tagGroups.map((group) =>
        [...group.querySelectorAll("span")].map((tag) => tag.textContent),
      ),
    ).toEqual([
      [
        "React",
        "JavaScript",
        "HTML",
        "CSS",
        "Vite",
        "PHP",
        "MariaDB",
        "PHPMailer",
        "GitHub Actions",
        "Hostinger",
      ],
      [
        "React",
        "JavaScript",
        "HTML",
        "CSS",
        "Vite",
        "PHP",
        "PHPMailer",
        "Sentry",
        "GitHub Actions",
        "Z.com",
      ],
      [
        "Python",
        "Django",
        "HTML",
        "CSS",
        "JavaScript",
        "PostgreSQL",
        "Gmail SMTP",
        "Vercel",
      ],
      ["Python", "Django", "HTML", "CSS", "JavaScript", "PostgreSQL", "Vercel"],
    ]);
    expect(
      tagGroups.every((group) =>
        [...group.querySelectorAll("span")].every((tag) =>
          tag.querySelector("svg"),
        ),
      ),
    ).toBe(true);
    expect(
      [...container.querySelectorAll(".project-card__tags span")].every((tag) =>
        /^#[0-9a-f]{6}$/.test(tag.style.getPropertyValue("--brand-color")),
      ),
    ).toBe(true);
    expect(
      [...tagGroups[2].querySelectorAll("span")].map((tag) => [
        tag.textContent,
        tag.style.getPropertyValue("--brand-color"),
      ]),
    ).toEqual([
      ["Python", "#3776ab"],
      ["Django", "#092e20"],
      ["HTML", "#e34f26"],
      ["CSS", "#663399"],
      ["JavaScript", "#f7df1e"],
      ["PostgreSQL", "#4169e1"],
      ["Gmail SMTP", "#ea4335"],
      ["Vercel", "#000000"],
    ]);
    expect(container.querySelector(".project-card__featured")).toBeNull();
    expect(screen.queryByText("HOA Dues Management")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "View RGT Website (opens in a new tab)",
      }),
    ).toHaveAttribute("href", "https://rgt-official.vercel.app/");
    expect(
      screen.getByRole("link", {
        name: "View OXPOS (opens in a new tab)",
      }),
    ).toHaveAttribute("href", "https://oxpos-official.vercel.app/");
    expect(screen.queryByText("Start a conversation")).not.toBeInTheDocument();
    const email = screen.getByText("michaeljohnojoy26@gmail.com");
    expect(email.parentElement.tagName).toBe("DIV");
    expect(email.parentElement.querySelectorAll("svg")).toHaveLength(2);
    expect(
      screen.queryByRole("link", { name: "michaeljohnojoy26@gmail.com" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Philippine Time (UTC+8)")).toBeInTheDocument();
    expect(
      screen.getByText("I reply within 2 business days."),
    ).toBeInTheDocument();
  });

  it("explains the services and working process", () => {
    const { container } = render(<App />);
    const services = container.querySelector("#services");
    expect(services).toHaveAttribute("aria-labelledby", "services-title");
    expect(
      [...services.querySelectorAll(".service-card h3")].map(
        (heading) => heading.textContent,
      ),
    ).toEqual([
      "Websites & content systems",
      "Business tools",
      "Technical support",
    ]);
    expect(
      services.querySelectorAll(".service-card__deliverable"),
    ).toHaveLength(3);
    expect(
      [...services.querySelectorAll(".services__step h4")].map(
        (heading) => heading.textContent,
      ),
    ).toEqual(["Discover", "Build", "Launch & support"]);
    expect(
      screen.getByRole("link", { name: /More about working together/ }),
    ).toHaveAttribute("href", "#services");
  });

  it("copies the visible email address and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email address" }));

    expect(writeText).toHaveBeenCalledWith("michaeljohnojoy26@gmail.com");
    expect(
      await screen.findByRole("button", { name: "Email copied" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Email address copied to clipboard.",
    );
  });

  it("keeps the email readable when clipboard access fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email address" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Unable to copy. Please select the email address above.",
    );
    expect(screen.getByText("michaeljohnojoy26@gmail.com")).toBeInTheDocument();
  });

  it("shows the updated experience timeline in the requested order", () => {
    render(<App />);
    const timeline = screen.getByRole("list", {
      name: "Selected professional experience",
    });
    const entries = [...timeline.querySelectorAll("li")];

    expect(entries).toHaveLength(4);
    expect(entries[0]).toHaveTextContent("2021 — Present");
    expect(entries[0]).toHaveTextContent("Freelance Developer");
    expect(entries[0]).toHaveTextContent("Global");
    expect(entries[3]).toHaveTextContent("IT Support Roles");
  });

  it("reveals alternating experience rows when the timeline enters view", () => {
    const observers = [];
    class TestIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
        this.observed = [];
        this.disconnect = vi.fn();
        observers.push(this);
      }
      observe(element) {
        this.observed.push(element);
      }
    }
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);

    render(<App />);
    const timeline = screen.getByRole("list", {
      name: "Selected professional experience",
    });
    const entries = [...timeline.querySelectorAll("li")];
    expect(timeline).toHaveClass("is-pending");
    expect(
      entries.map((entry) =>
        entry.classList.contains("experience__row--from-left"),
      ),
    ).toEqual([true, false, true, false]);
    expect(
      entries.map((entry) =>
        entry.style.getPropertyValue("--experience-delay"),
      ),
    ).toEqual(["0ms", "120ms", "240ms", "360ms"]);

    const observer = observers.find((item) => item.observed.includes(timeline));
    act(() => observer.callback([{ isIntersecting: true }]));
    expect(timeline).toHaveClass("is-revealed");
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("opens and closes the compact navigation with links and Escape", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    const nav = screen.getByRole("navigation", { name: "Main navigation" });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", nav.id);
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(nav).toHaveClass("is-open");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();

    fireEvent.click(button);
    fireEvent.click(screen.getByRole("link", { name: "ABOUT" }));
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("frosts the header after scrolling and restores it at the top", () => {
    vi.stubGlobal("scrollY", 0);
    const { container } = render(<App />);
    const header = container.querySelector(".site-header");
    expect(header).not.toHaveClass("is-frosted");

    vi.stubGlobal("scrollY", 32);
    fireEvent.scroll(window);
    expect(header).toHaveClass("is-frosted");

    vi.stubGlobal("scrollY", 0);
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("is-frosted");
  });

  it("reveals each project only when it enters view", () => {
    const observers = [];
    class TestIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
        this.observed = [];
        this.disconnect = vi.fn();
        observers.push(this);
      }
      observe(element) {
        this.observed.push(element);
      }
    }
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);

    const { container } = render(<App />);
    const cards = [...container.querySelectorAll(".project-card")];
    const firstObserver = observers.find((observer) =>
      observer.observed.includes(cards[0]),
    );
    expect(cards).toHaveLength(4);
    expect(cards.every((card) => card.classList.contains("is-pending"))).toBe(
      true,
    );

    act(() => firstObserver.callback([{ isIntersecting: false }]));
    expect(cards[0]).toHaveClass("is-pending");
    act(() => firstObserver.callback([{ isIntersecting: true }]));
    expect(cards[0]).toHaveClass("is-revealed");
    expect(cards[1]).toHaveClass("is-pending");
    expect(firstObserver.disconnect).toHaveBeenCalled();
  });

  it("reveals each skill group when it enters view", () => {
    const observers = [];
    class TestIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
        this.observed = [];
        this.disconnect = vi.fn();
        observers.push(this);
      }
      observe(element) {
        this.observed.push(element);
      }
    }
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);

    const { container } = render(<App />);
    const groups = [...container.querySelectorAll(".stack__group")];
    expect(
      groups.map((group) => group.querySelector("h3").textContent),
    ).toEqual([
      "Frontend",
      "Backend & data",
      "Workflow and Delivery",
      "Misc & IT support",
    ]);
    const labels = (group) =>
      [...group.querySelectorAll(".stack__item")].map((item) =>
        item.textContent.trim(),
      );
    expect(labels(groups[1])).toContain("Node.js");
    expect(labels(groups[1])).toContain("SQL");
    expect(labels(groups[0])).toEqual(
      expect.arrayContaining([
        "TypeScript",
        "Next.js",
        "Vue.js",
        "Angular",
        "Tailwind CSS",
      ]),
    );
    expect(labels(groups[1])).toEqual(
      expect.arrayContaining([
        "Express",
        "Laravel",
        "ASP.NET Core",
        "MySQL",
        "MongoDB",
        "SQLite",
      ]),
    );
    expect(labels(groups[2])).toEqual(
      expect.arrayContaining([
        "GitHub Actions",
        "Docker",
        "Vercel",
        "Postman",
        "Vitest",
        "Figma",
      ]),
    );
    const removedSkills = [
      "Astro",
      "Nuxt",
      "Svelte",
      "FastAPI",
      "Spring Boot",
      "Redis",
      "NestJS",
      "Terraform",
      "Kubernetes",
      "AWS",
      "Playwright",
    ];
    const allLabels = groups.flatMap(labels);
    for (const skill of removedSkills) {
      expect(allLabels).not.toContain(skill);
    }
    for (const group of groups) {
      expect(group.querySelectorAll(".stack__items")).toHaveLength(1);
      expect(group.querySelector(".stack__collection-title")).toBeNull();
      expect(
        [...group.querySelectorAll(".stack__item")].map((item) =>
          item.style.getPropertyValue("--drop-index"),
        ),
      ).toEqual(labels(group).map((_, index) => String(index)));
    }
    expect(labels(groups[2])).not.toContain("Jira");
    expect(labels(groups[3])).toEqual(
      expect.arrayContaining([
        "Active Directory",
        "Application Support",
        "Remote Troubleshooting",
        "PayMongo",
        "Excel Automations",
        "Jira",
      ]),
    );
    expect(
      [...groups[3].querySelectorAll(".stack__item")].map((item) =>
        item.style.getPropertyValue("--drop-index"),
      ),
    ).toEqual(labels(groups[3]).map((_, index) => String(index)));
    expect(
      groups.every((group) => group.classList.contains("is-pending")),
    ).toBe(true);

    const observer = observers.find((item) =>
      item.observed.includes(groups[3]),
    );
    act(() => observer.callback([{ isIntersecting: true }]));
    expect(groups[3]).toHaveClass("is-revealed");
    expect(groups[0]).toHaveClass("is-pending");
    expect(observer.disconnect).toHaveBeenCalled();

    vi.spyOn(groups[2], "getBoundingClientRect").mockReturnValue({
      top: -200,
      height: 300,
    });
    fireEvent.scroll(window);
    expect(groups[2]).toHaveClass("is-revealed");
  });
});
