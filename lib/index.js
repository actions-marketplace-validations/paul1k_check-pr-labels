"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = core.getInput("github-token", { required: true });
        const octokit = github.getOctokit(token);
        const labelNames = yield getPullRequestLabelNames(octokit);
        const labels = getInputLabels();
        const result = labels.every((label) => labelNames.includes(label));
        if (result) {
            core.warning("required labels didn't find");
        }
        core.setOutput("result", result);
        core.setOutput("labels", labelNames);
    });
}
function getPullRequestLabelNames(octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        const owner = github.context.repo.owner;
        const repo = github.context.repo.repo;
        const pull_number = core.getInput("pull-number", { required: true });
        const { data } = yield octokit.rest.pulls.get({
            owner,
            repo,
            pull_number,
        });
        return data.labels.length > 0 ? data.labels.map((label) => label.name) : [];
    });
}
function getInputLabels() {
    const raw = core.getInput("labels", { required: true });
    const json = JSON.parse(raw);
    return Array.isArray(json) ? json : [];
}
run().catch((err) => {
    core.setFailed(err.message);
});
