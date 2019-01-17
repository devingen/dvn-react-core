import { Rule } from './Rules/Rule';
import { doesSatisfyRule } from './RuleUtils';

describe('RuleUtils', () => {

  describe('or', () => {

    it('should return true for empty rules', () => {

      const rule: Rule = {
        operator: 'or',
        rules: [],
        type: 'group',
      };

      const data = {
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeTruthy();
    });

    it('should return true for single rule when rule passes', () => {

      const rule: Rule = {
        operator: 'or',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'AÜ',
        }],
        type: 'group',
      };

      const data = {
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeTruthy();
    });

    it('should return false for single rule when rule fails', () => {

      const rule: Rule = {
        operator: 'or',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'İTÜ',
        }],
        type: 'group',
      };

      const data = {
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeFalsy();
    });

    it('should return true for two rules when both of them pass', () => {

      const rule: Rule = {
        operator: 'or',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'İTÜ',
        }, {
          condition: 'eq',
          key: 'class',
          type: 'condition',
          value: '4',
        }],
        type: 'group',
      };

      const data = {
        class: 4,
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeTruthy();
    });

    it('should return true for two rules when one of them passes', () => {

      const rule: Rule = {
        operator: 'or',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'İTÜ',
        }, {
          condition: 'eq',
          key: 'class',
          type: 'condition',
          value: '4',
        }],
        type: 'group',
      };

      const data = {
        class: 4,
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeTruthy();
    });
  });

  describe('and', () => {

    it('should return true for empty rules', () => {

      const rule: Rule = {
        operator: 'and',
        rules: [],
        type: 'group',
      };

      const data = {
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeTruthy();
    });

    it('should return true for single rule when rule passes', () => {

      const rule: Rule = {
        operator: 'and',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'AÜ',
        }],
        type: 'group',
      };

      const data = {
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeTruthy();
    });

    it('should return false for single "and" rule when rule fails', () => {

      const rule: Rule = {
        operator: 'and',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'İTÜ',
        }],
        type: 'group',
      };

      const data = {
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeFalsy();
    });

    it('should return true for two rules when both of them pass', () => {

      const rule: Rule = {
        operator: 'or',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'İTÜ',
        }, {
          condition: 'eq',
          key: 'class',
          type: 'condition',
          value: '4',
        }],
        type: 'group',
      };

      const data = {
        class: 4,
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeTruthy();
    });

    it('should return false for two rules when one of them passes', () => {

      const rule: Rule = {
        operator: 'or',
        rules: [{
          condition: 'eq',
          key: 'university',
          type: 'condition',
          value: 'İTÜ',
        }, {
          condition: 'eq',
          key: 'class',
          type: 'condition',
          value: '2',
        }],
        type: 'group',
      };

      const data = {
        class: 4,
        university: 'AÜ',
      };
      expect(doesSatisfyRule(rule, data)).toBeFalsy();
    });
  });
});
