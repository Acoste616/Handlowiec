-- Add qualification fields to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_size TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS decision_maker TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS expected_roi TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS current_solution TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pain_points TEXT[];
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS current_results TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS main_goals TEXT[];
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS priority_areas TEXT[];
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS success_metrics TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS previous_experience TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS specific_requirements TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMPTZ;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_leads_industry ON leads(industry);
CREATE INDEX IF NOT EXISTS idx_leads_company_size ON leads(company_size);
CREATE INDEX IF NOT EXISTS idx_leads_budget ON leads(budget);
CREATE INDEX IF NOT EXISTS idx_leads_qualified_at ON leads(qualified_at); 