import { SupabaseClient } from "@supabase/supabase-js";
import {
  CreatePricingPlanBody,
  PricingPlan,
  PricingPlanWithDetails,
  UpdatePricingPlanBody,
} from "../types/pricing.type";

const SELECT_WITH_DETAILS = `
  *,
  features:plan_features(id, feature, sort_order),
  not_included:plan_not_included(id, feature, sort_order)
`;

export class PricingService {
  constructor(private supabase: SupabaseClient) {}

  
  async getAllActive(): Promise<PricingPlanWithDetails[]> {
    const { data, error } = await this.supabase
      .from("pricing_plans")
      .select(SELECT_WITH_DETAILS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data as PricingPlanWithDetails[];
  }

  // ── Admin: semua plan ─────────────────────────────────
  async getAll(): Promise<PricingPlanWithDetails[]> {
    const { data, error } = await this.supabase
      .from("pricing_plans")
      .select(SELECT_WITH_DETAILS)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data as PricingPlanWithDetails[];
  }

  // ── Get by ID ─────────────────────────────────────────
  async getById(id: string): Promise<PricingPlanWithDetails> {
    const { data, error } = await this.supabase
      .from("pricing_plans")
      .select(SELECT_WITH_DETAILS)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Plan not found");
    return data as PricingPlanWithDetails;
  }

  // ── Get by Tier ───────────────────────────────────────
  async getByTier(tier: string): Promise<PricingPlanWithDetails> {
    const { data, error } = await this.supabase
      .from("pricing_plans")
      .select(SELECT_WITH_DETAILS)
      .eq("tier", tier)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Plan not found");
    return data as PricingPlanWithDetails;
  }

  // ── Create ────────────────────────────────────────────
  async create(body: CreatePricingPlanBody): Promise<PricingPlanWithDetails> {
    const { features, not_included, ...planData } = body;

    const { data: plan, error } = await this.supabase
      .from("pricing_plans")
      .insert(planData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (features?.length) {
      const { error: e } = await this.supabase
        .from("plan_features")
        .insert(features.map((f, i) => ({
          plan_id: plan.id,
          feature: f.feature,
          sort_order: f.sort_order ?? i,
        })));
      if (e) throw new Error(e.message);
    }

    if (not_included?.length) {
      const { error: e } = await this.supabase
        .from("plan_not_included")
        .insert(not_included.map((f, i) => ({
          plan_id: plan.id,
          feature: f.feature,
          sort_order: f.sort_order ?? i,
        })));
      if (e) throw new Error(e.message);
    }

    return this.getById(plan.id);
  }

  // ── Update ────────────────────────────────────────────
  async update(id: string, body: UpdatePricingPlanBody): Promise<PricingPlanWithDetails> {
    const { features, not_included, ...planData } = body;

    if (Object.keys(planData).length > 0) {
      const { error } = await this.supabase
        .from("pricing_plans")
        .update(planData)
        .eq("id", id);
      if (error) throw new Error(error.message);
    }

    if (features !== undefined) {
      await this.supabase.from("plan_features").delete().eq("plan_id", id);
      if (features.length > 0) {
        const { error } = await this.supabase
          .from("plan_features")
          .insert(features.map((f, i) => ({
            plan_id: id,
            feature: f.feature,
            sort_order: f.sort_order ?? i,
          })));
        if (error) throw new Error(error.message);
      }
    }

    if (not_included !== undefined) {
      await this.supabase.from("plan_not_included").delete().eq("plan_id", id);
      if (not_included.length > 0) {
        const { error } = await this.supabase
          .from("plan_not_included")
          .insert(not_included.map((f, i) => ({
            plan_id: id,
            feature: f.feature,
            sort_order: f.sort_order ?? i,
          })));
        if (error) throw new Error(error.message);
      }
    }

    return this.getById(id);
  }

  // ── Delete ────────────────────────────────────────────
  async delete(id: string): Promise<{ message: string }> {
    const { error } = await this.supabase
      .from("pricing_plans")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { message: "Plan deleted successfully" };
  }

  // ── Toggle Active ─────────────────────────────────────
  async toggleActive(id: string): Promise<PricingPlan> {
    const plan = await this.getById(id);

    const { data, error } = await this.supabase
      .from("pricing_plans")
      .update({ is_active: !plan.is_active })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as PricingPlan;
  }
}