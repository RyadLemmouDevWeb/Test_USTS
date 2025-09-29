import LogsPanel from "./LogsPanel-Dnye7u5y.js";
import { d as defineComponent, a2 as useWorkflowsStore, x as computed, e as createBlock, f as createCommentVNode, g as openBlock } from "./index-DtLsVys_.js";
import "./AnimatedSpinner-CKEReflL.js";
import "./ConsumedTokensDetails.vue_vue_type_script_setup_true_lang-BCusf_O4.js";
import "./core-CTe2_eax.js";
import "./canvas-CkZBMaKR.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DemoFooter",
  setup(__props) {
    const workflowsStore = useWorkflowsStore();
    const hasExecutionData = computed(() => workflowsStore.workflowExecutionData);
    return (_ctx, _cache) => {
      return hasExecutionData.value ? (openBlock(), createBlock(LogsPanel, {
        key: 0,
        "is-read-only": true
      })) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
