
"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MoveUpRight } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  technologies: string[] | null;
};

function ProjectCard({
  project,
  index,
  active,
}: {
  project: Project;
  index: number;
  active?: boolean;
}) {
  return (
    <article className="project-card coverflow-project-card">
      <div className="coverflow-image-wrap">
        {project.image_url ? (
          <img
            key={project.id}
            src={project.image_url}
            alt={project.title}
            className={`project-image ${active ? "coverflow-image-active" : ""}`}
            loading="lazy"
          />
        ) : (
          <div className="project-placeholder">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{project.title}</b>
          </div>
        )}

        <span className="coverflow-image-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="project-content">
        <div className="project-topline">
          <span>PROJECT / {String(index + 1).padStart(2, "0")}</span>
          <MoveUpRight size={16} />
        </div>

        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="tech-list">
          {(project.technologies ?? []).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <div className="project-links">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer">
              Live Website ↗
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer">
              Source code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsCarousel({
  projects,
}: {
  projects: Project[];
}) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);

  const goTo = (index: number) => {
    if (index < 0 || index >= projects.length) return;
    setCurrent(index);
  };

  const handleSwipe = (endX: number) => {
    if (touchStart.current === null) return;

    const distance = touchStart.current - endX;

    if (Math.abs(distance) > 40) {
      goTo(current + (distance > 0 ? 1 : -1));
    }

    touchStart.current = null;
  };

  if (!projects.length) return null;

  return (
    <div className="project-showcase">
      {/* DESKTOP: normal grid */}
      <div className="projects-grid desktop-projects">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>

      {/* MOBILE: coverflow */}
      <div className="mobile-coverflow">
        <div className="coverflow-heading">
          <span>SELECTED WORKS</span>
          <span>PORTFOLIO / 2026</span>
        </div>

        <div
          className="coverflow-stage"
          onTouchStart={(e) => {
            touchStart.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            handleSwipe(e.changedTouches[0].clientX);
          }}
        >
          {projects.map((project, index) => {
            const offset = index - current;

            // Pilih jarak terpendek untuk loop visual tidak diperlukan:
            // project di ujung tetap berhenti di batas.
            const visible = Math.abs(offset) <= 1;

            return (
              <div
                key={project.id}
                className={`coverflow-card ${
                  offset === 0 ? "is-active" : ""
                }`}
                style={{
                  transform: `translateX(calc(-50% + ${offset * 78}%)) scale(${
                    offset === 0 ? 1 : 0.82
                  }) rotateY(${offset * -13}deg)`,
                  opacity: visible ? (offset === 0 ? 1 : 0.58) : 0,
                  zIndex: 10 - Math.abs(offset),
                  pointerEvents: visible && offset === 0 ? "auto" : "none",
                }}
                aria-hidden={offset !== 0}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  active={offset === 0}
                />
              </div>
            );
          })}
        </div>

        <div className="coverflow-caption">
          <div className="coverflow-project-info">
            <span>FEATURED PROJECT</span>
            <h3>{projects[current].title}</h3>
            <p>
              {projects[current].technologies?.slice(0, 3).join(" · ") ||
                "Selected work"}
            </p>
          </div>

          <div className="coverflow-controls">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              aria-label="Previous project"
            >
              <ArrowLeft size={19} />
            </button>

            <button
              type="button"
              onClick={() => goTo(current + 1)}
              disabled={current === projects.length - 1}
              aria-label="Next project"
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>

        <div className="coverflow-progress">
          <span>{String(current + 1).padStart(2, "0")}</span>
          <div className="coverflow-progress-track">
            <div
              className="coverflow-progress-fill"
              style={{
                width: `${((current + 1) / projects.length) * 100}%`,
              }}
            />
          </div>
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>

        <p className="coverflow-hint">SWIPE TO EXPLORE</p>
      </div>
    </div>
  );
}
