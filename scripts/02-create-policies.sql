-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update their organizations" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- Organization members policies
CREATE POLICY "Users can view organization members" ON public.organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Assets policies
CREATE POLICY "Users can view organization assets" ON public.assets
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage organization assets" ON public.assets
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Scans policies
CREATE POLICY "Users can view organization scans" ON public.scans
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage organization scans" ON public.scans
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Vulnerabilities policies
CREATE POLICY "Users can view organization vulnerabilities" ON public.vulnerabilities
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage organization vulnerabilities" ON public.vulnerabilities
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Vulnerability comments policies
CREATE POLICY "Users can view vulnerability comments" ON public.vulnerability_comments
  FOR SELECT USING (
    vulnerability_id IN (
      SELECT id FROM public.vulnerabilities 
      WHERE organization_id IN (
        SELECT organization_id FROM public.organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create vulnerability comments" ON public.vulnerability_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI chat sessions policies
CREATE POLICY "Users can view own chat sessions" ON public.ai_chat_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own chat sessions" ON public.ai_chat_sessions
  FOR ALL USING (user_id = auth.uid());

-- Threat intelligence policies
CREATE POLICY "Users can view organization threat intelligence" ON public.threat_intelligence
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );
