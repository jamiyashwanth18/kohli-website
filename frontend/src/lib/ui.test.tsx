/**
 * Behavioural coverage for the shared component vocabulary in ui.tsx.
 *
 * This file has no acceptance criteria of its own -- the ticket is "unit
 * tests for ui.tsx". So the contract tested here is the one the file itself
 * states: every component renders what it's given, forwards the DOM
 * attributes and event handlers a caller passes it, and the handful of
 * components with real interaction logic (Select, Checkbox, Switch, Tabs,
 * Avatar) behave correctly for a user driving them, not just for a mock.
 *
 * Deliberately not asserted: Tailwind class names or inline `--brand-*`
 * custom-property values. Those encode the "quiet by default, brand paints
 * it" design the file's own header describes, and asserting them would fail
 * on a restyle that broke nothing while missing a rewrite that broke
 * everything -- exactly the trap the test-writing brief warns against.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Empty,
  Input,
  Label,
  Select,
  Separator,
  Stat,
  Switch,
  Tabs,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Textarea,
} from "./ui";

describe("Button", () => {
  it("renders its label and fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save changes
      </Button>
    );

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
  });

  it("falls back to the primary variant for an unknown variant instead of crashing", () => {
    render(<Button variant="not-a-real-variant">Go</Button>);

    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });
});

describe("Card family", () => {
  it("composes header, title, description, content and footer into one card", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Plan usage</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>1,204 requests</CardContent>
        <CardFooter>
          <Button>View details</Button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByRole("heading", { name: "Plan usage" })).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByText("1,204 requests")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View details" })).toBeInTheDocument();
  });
});

describe("Input and Textarea", () => {
  it("lets a user type into Input and reports the value via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input placeholder="Email address" onChange={onChange} />);

    const field = screen.getByPlaceholderText("Email address");
    await user.type(field, "amara@example.com");

    expect(field).toHaveValue("amara@example.com");
    expect(onChange).toHaveBeenCalled();
  });

  it("lets a user type multi-line text into Textarea", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Notes" />);

    const field = screen.getByPlaceholderText("Notes");
    await user.type(field, "Line one{enter}Line two");

    expect(field).toHaveValue("Line one\nLine two");
  });
});

describe("Label", () => {
  it("associates with its control via htmlFor so clicking the label focuses the input", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="you@example.com" />
      </>
    );

    await user.click(screen.getByText("Email"));

    expect(screen.getByPlaceholderText("you@example.com")).toHaveFocus();
  });
});

describe("Select", () => {
  it("renders the given options and reports the chosen value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select
        aria-label="Role"
        options={[
          { value: "admin", label: "Admin" },
          { value: "viewer", label: "Viewer" },
        ]}
        onChange={onChange}
      />
    );

    const select = screen.getByRole("combobox", { name: "Role" });
    expect(screen.getByRole("option", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Viewer" })).toBeInTheDocument();

    await user.selectOptions(select, "viewer");

    expect(select).toHaveValue("viewer");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders explicit children instead of options when both are given", () => {
    render(
      <Select aria-label="Status" options={[{ value: "x", label: "Should not render" }]}>
        <option value="open">Open</option>
      </Select>
    );

    expect(screen.getByRole("option", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Should not render" })).not.toBeInTheDocument();
  });
});

describe("Checkbox", () => {
  it("toggles checked state when a user clicks it", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept terms" />);

    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).not.toBeChecked();

    await user.click(box);

    expect(box).toBeChecked();
  });
});

describe("Switch", () => {
  it("calls onChange when clicked and reflects the checked prop it's given", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} />);

    const toggle = screen.getByRole("checkbox", { hidden: true });
    expect(toggle).not.toBeChecked();

    await user.click(toggle);

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe("Badge", () => {
  it("renders its content for every known variant", () => {
    const variants = ["default", "success", "warning", "danger", "accent"] as const;
    for (const variant of variants) {
      render(<Badge variant={variant}>{variant}</Badge>);
    }

    for (const variant of variants) {
      expect(screen.getByText(variant)).toBeInTheDocument();
    }
  });
});

describe("Table family", () => {
  it("renders a semantic table a screen reader and a user both navigate by row and cell", () => {
    render(
      <Table aria-label="Invoices">
        <THead>
          <TR>
            <TH>Invoice</TH>
            <TH>Amount</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>INV-001</TD>
            <TD>$42.00</TD>
          </TR>
        </TBody>
      </Table>
    );

    expect(screen.getByRole("table", { name: "Invoices" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "INV-001" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "$42.00" })).toBeInTheDocument();
  });
});

describe("Avatar", () => {
  it("shows initials built from the first two words of the name when there is no image", () => {
    render(<Avatar name="Amara Okonkwo" />);

    expect(screen.getByText("AO")).toBeInTheDocument();
  });

  it("caps initials at two letters for a longer name", () => {
    render(<Avatar name="Amara Chidi Okonkwo" />);

    expect(screen.getByText("AC")).toBeInTheDocument();
  });

  it("renders the image with accessible alt text when a src is given", () => {
    render(<Avatar name="Amara Okonkwo" src="https://example.com/amara.png" />);

    const img = screen.getByRole("img", { name: "Amara Okonkwo" });
    expect(img).toHaveAttribute("src", "https://example.com/amara.png");
    expect(screen.queryByText("AO")).not.toBeInTheDocument();
  });
});

describe("Separator", () => {
  it("renders as a horizontal rule", () => {
    render(<Separator />);

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

describe("Tabs", () => {
  it("calls onChange with the key of the tab a user clicks", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs
        tabs={[
          { key: "overview", label: "Overview" },
          { key: "billing", label: "Billing" },
        ]}
        active="overview"
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Billing" }));

    expect(onChange).toHaveBeenCalledWith("billing");
  });
});

describe("Stat", () => {
  it("renders the label and value always, and the hint only when given", () => {
    const { rerender } = render(<Stat label="Active users" value={128} />);

    expect(screen.getByText("Active users")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.queryByText(/vs last week/)).not.toBeInTheDocument();

    rerender(<Stat label="Active users" value={128} hint="+4% vs last week" />);

    expect(screen.getByText("+4% vs last week")).toBeInTheDocument();
  });
});

describe("Empty", () => {
  it("renders the title always, and the description and action only when given", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <Empty
        title="No results"
        description="Try a different search."
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    );

    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("omits the description when none is given", () => {
    render(<Empty title="Nothing here" />);

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
