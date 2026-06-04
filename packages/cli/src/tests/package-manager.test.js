import { describe, it, expect, vi, afterEach } from "vitest";
import { installDependencies } from "../utils/package-manager.js";
import { execSync } from "child_process";

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

describe("package manager utilities", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should allow valid package names and call execSync", () => {
    const result = installDependencies(["framer-motion", "gsap", "@types/react"]);
    
    expect(result.command).toContain("framer-motion gsap @types/react");
    expect(execSync).toHaveBeenCalled();
  });

  it("should block package names containing malicious shell script characters", () => {
    expect(() => {
      installDependencies(["framer-motion; echo 'HACKED'"]);
    }).toThrow("Invalid package name(s) detected");
    
    expect(execSync).not.toHaveBeenCalled();
  });

  it("should block package names containing backticks or shell operators", () => {
    expect(() => {
      installDependencies(["framer-motion && rm -rf /"]);
    }).toThrow("Invalid package name(s) detected");
    
    expect(() => {
      installDependencies(["framer-motion`id`"]);
    }).toThrow("Invalid package name(s) detected");

    expect(execSync).not.toHaveBeenCalled();
  });
});
