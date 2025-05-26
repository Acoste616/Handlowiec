'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TriggerCondition {
  field: string;
  operator: string;
  value: string;
}

interface Action {
  type: string;
  parameters: { [key: string]: any };
}

interface AutomationRule {
  name: string;
  description: string;
  category: 'lead_scoring' | 'lead_routing' | 'follow_up' | 'notification' | 'data_enrichment';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  triggers: TriggerCondition[];
  actions: Action[];
}

export default function NewRulePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rule, setRule] = useState<AutomationRule>({
    name: '',
    description: '',
    category: 'lead_scoring',
    priority: 'medium',
    isActive: true,
    triggers: [{ field: '', operator: '', value: '' }],
    actions: [{ type: '', parameters: {} }]
  });

  const triggerFields = [
    { value: 'budget', label: 'Budżet' },
    { value: 'timeline', label: 'Timeline' },
    { value: 'companySize', label: 'Wielkość firmy' },
    { value: 'industry', label: 'Branża' },
    { value: 'decisionMaker', label: 'Rola decyzyjna' },
    { value: 'painPoints', label: 'Pain points' },
    { value: 'leadScore', label: 'Lead score' },
    { value: 'source', label: 'Źródło leada' },
    { value: 'createdAt', label: 'Data utworzenia' }
  ];

  const operators = [
    { value: 'equals', label: 'Równa się' },
    { value: 'not_equals', label: 'Nie równa się' },
    { value: 'greater_than', label: 'Większe niż' },
    { value: 'less_than', label: 'Mniejsze niż' },
    { value: 'contains', label: 'Zawiera' },
    { value: 'not_contains', label: 'Nie zawiera' },
    { value: 'in', label: 'Jest w' },
    { value: 'not_in', label: 'Nie jest w' }
  ];

  const actionTypes = [
    { value: 'assign_agent', label: 'Przypisz agenta', category: 'lead_routing' },
    { value: 'set_priority', label: 'Ustaw priorytet', category: 'lead_scoring' },
    { value: 'add_tag', label: 'Dodaj tag', category: 'data_enrichment' },
    { value: 'send_email', label: 'Wyślij email', category: 'follow_up' },
    { value: 'create_task', label: 'Utwórz zadanie', category: 'follow_up' },
    { value: 'send_notification', label: 'Wyślij powiadomienie', category: 'notification' },
    { value: 'update_score', label: 'Aktualizuj score', category: 'lead_scoring' },
    { value: 'move_to_stage', label: 'Przenieś do etapu', category: 'lead_routing' }
  ];

  const addTrigger = () => {
    setRule(prev => ({
      ...prev,
      triggers: [...prev.triggers, { field: '', operator: '', value: '' }]
    }));
  };

  const removeTrigger = (index: number) => {
    setRule(prev => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index)
    }));
  };

  const updateTrigger = (index: number, field: keyof TriggerCondition, value: string) => {
    setRule(prev => ({
      ...prev,
      triggers: prev.triggers.map((trigger, i) => 
        i === index ? { ...trigger, [field]: value } : trigger
      )
    }));
  };

  const addAction = () => {
    setRule(prev => ({
      ...prev,
      actions: [...prev.actions, { type: '', parameters: {} }]
    }));
  };

  const removeAction = (index: number) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, type: string) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { type, parameters: {} } : action
      )
    }));
  };

  const updateActionParameter = (actionIndex: number, paramKey: string, paramValue: any) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === actionIndex 
          ? { ...action, parameters: { ...action.parameters, [paramKey]: paramValue } }
          : action
      )
    }));
  };

  const renderActionParameters = (action: Action, actionIndex: number) => {
    switch (action.type) {
      case 'assign_agent':
        return (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent
            </label>
            <select
              value={action.parameters.agentId || ''}
              onChange={(e) => updateActionParameter(actionIndex, 'agentId', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Wybierz agenta</option>
              <option value="auto">Automatyczny wybór</option>
              <option value="1">Jan Kowalski</option>
              <option value="2">Anna Nowak</option>
              <option value="3">Piotr Wiśniewski</option>
            </select>
          </div>
        );

      case 'set_priority':
        return (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorytet
            </label>
            <select
              value={action.parameters.priority || ''}
              onChange={(e) => updateActionParameter(actionIndex, 'priority', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Wybierz priorytet</option>
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
            </select>
          </div>
        );

      case 'add_tag':
        return (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag
            </label>
            <input
              type="text"
              value={action.parameters.tag || ''}
              onChange={(e) => updateActionParameter(actionIndex, 'tag', e.target.value)}
              placeholder="Nazwa tagu"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        );

      case 'send_email':
        return (
          <div className="mt-2 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Szablon emaila
              </label>
              <select
                value={action.parameters.template || ''}
                onChange={(e) => updateActionParameter(actionIndex, 'template', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Wybierz szablon</option>
                <option value="welcome">Powitanie</option>
                <option value="follow_up">Follow-up</option>
                <option value="proposal">Propozycja</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opóźnienie (minuty)
              </label>
              <input
                type="number"
                value={action.parameters.delay || 0}
                onChange={(e) => updateActionParameter(actionIndex, 'delay', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        );

      case 'create_task':
        return (
          <div className="mt-2 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Typ zadania
              </label>
              <select
                value={action.parameters.taskType || ''}
                onChange={(e) => updateActionParameter(actionIndex, 'taskType', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Wybierz typ</option>
                <option value="call">Telefon</option>
                <option value="email">Email</option>
                <option value="meeting">Spotkanie</option>
                <option value="follow_up">Follow-up</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis zadania
              </label>
              <input
                type="text"
                value={action.parameters.description || ''}
                onChange={(e) => updateActionParameter(actionIndex, 'description', e.target.value)}
                placeholder="Opis zadania"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        );

      case 'update_score':
        return (
          <div className="mt-2 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operacja
              </label>
              <select
                value={action.parameters.operation || ''}
                onChange={(e) => updateActionParameter(actionIndex, 'operation', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Wybierz operację</option>
                <option value="add">Dodaj punkty</option>
                <option value="subtract">Odejmij punkty</option>
                <option value="set">Ustaw wartość</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wartość
              </label>
              <input
                type="number"
                value={action.parameters.value || 0}
                onChange={(e) => updateActionParameter(actionIndex, 'value', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rule.name.trim()) {
      setError('Nazwa reguły jest wymagana');
      return;
    }

    if (rule.triggers.some(t => !t.field || !t.operator || !t.value)) {
      setError('Wszystkie warunki muszą być wypełnione');
      return;
    }

    if (rule.actions.some(a => !a.type)) {
      setError('Wszystkie akcje muszą być wybrane');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Symulacja zapisywania reguły
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Saving rule:', rule);

      // Przekierowanie po zapisaniu
      router.push('/super-admin/automation');
    } catch (error) {
      console.error('Error saving rule:', error);
      setError('Błąd podczas zapisywania reguły');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/super-admin/automation"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Wróć
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">➕ Nowa reguła automatyzacji</h1>
                <p className="text-sm text-gray-500">
                  Utwórz nową regułę automatyzacji procesów
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Podstawowe informacje</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa reguły *
                </label>
                <input
                  type="text"
                  value={rule.name}
                  onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Np. Automatyczne przypisanie wysokich leadów"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria
                </label>
                <select
                  value={rule.category}
                  onChange={(e) => setRule(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="lead_scoring">Lead Scoring</option>
                  <option value="lead_routing">Routing Leadów</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="notification">Powiadomienia</option>
                  <option value="data_enrichment">Wzbogacanie Danych</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorytet
                </label>
                <select
                  value={rule.priority}
                  onChange={(e) => setRule(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={(e) => setRule(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="form-checkbox text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Aktywna</span>
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis
              </label>
              <textarea
                value={rule.description}
                onChange={(e) => setRule(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Opisz co robi ta reguła..."
              />
            </div>
          </div>

          {/* Triggers */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Warunki wyzwalające</h3>
              <button
                type="button"
                onClick={addTrigger}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                + Dodaj warunek
              </button>
            </div>

            <div className="space-y-4">
              {rule.triggers.map((trigger, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Warunek {index + 1}
                    </span>
                    {rule.triggers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTrigger(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Usuń
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pole
                      </label>
                      <select
                        value={trigger.field}
                        onChange={(e) => updateTrigger(index, 'field', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Wybierz pole</option>
                        {triggerFields.map(field => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operator
                      </label>
                      <select
                        value={trigger.operator}
                        onChange={(e) => updateTrigger(index, 'operator', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Wybierz operator</option>
                        {operators.map(op => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Wartość
                      </label>
                      <input
                        type="text"
                        value={trigger.value}
                        onChange={(e) => updateTrigger(index, 'value', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="Wartość"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Akcje do wykonania</h3>
              <button
                type="button"
                onClick={addAction}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                + Dodaj akcję
              </button>
            </div>

            <div className="space-y-4">
              {rule.actions.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Akcja {index + 1}
                    </span>
                    {rule.actions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Usuń
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Typ akcji
                    </label>
                    <select
                      value={action.type}
                      onChange={(e) => updateAction(index, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="">Wybierz akcję</option>
                      {actionTypes
                        .filter(actionType => rule.category === 'lead_scoring' || actionType.category === rule.category || actionType.category === 'data_enrichment')
                        .map(actionType => (
                          <option key={actionType.value} value={actionType.value}>
                            {actionType.label}
                          </option>
                        ))}
                    </select>

                    {renderActionParameters(action, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/super-admin/automation"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz regułę'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 