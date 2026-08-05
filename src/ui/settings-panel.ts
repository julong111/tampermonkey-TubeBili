import { gm, type GmApi } from '../core/gm-api.js';
import { t } from '../core/i18n.js';
import { shortcutSpeedListKey, buttonSpeedListKey } from '../settings/speed-list-constants.js';
import { validateSpeedList } from '../settings/speed-list.js';
import type { SettingItem } from '../settings/catalog.js';
import {
  getShortcutSpeeds,
  getButtonSpeeds,
  getDefaultSpeed,
  getSettingPanelItems,
  getCurrentLang,
  setSpeedLists
} from '../settings/store.js';

let settingPanelInitialized = false;
let settingPanelElement: HTMLElement | null = null;

function getText(key: string): string {
  return t(key, getCurrentLang());
}

function createSpeedList(speeds: string[], select: HTMLSelectElement): void {
  speeds.forEach((speed) => {
    const option = document.createElement("option");
    option.value = speed;
    option.textContent = speed;
    select.appendChild(option);
  });
}

function updateSpeedSelects(shortcutSpeedsNew: string[], buttonSpeedsNew: string[], shortcutSpeedListString?: string, buttonSpeedListString?: string): void {
  setSpeedLists(shortcutSpeedsNew, buttonSpeedsNew);

  if (shortcutSpeedListString !== void 0) {
    const shortcutSpeedListInput = document.getElementById("shortcutSpeedListInput") as HTMLInputElement | null;
    if (shortcutSpeedListInput) {
      shortcutSpeedListInput.value = shortcutSpeedListString;
    }
  }

  if (buttonSpeedListString !== void 0) {
    const buttonSpeedListInput = document.getElementById("buttonSpeedListInput") as HTMLInputElement | null;
    if (buttonSpeedListInput) {
      buttonSpeedListInput.value = buttonSpeedListString;
    }
  }

  const selectIds = ["Youtube_Action_Rate_Value", "Bilibili_Action_Rate_Value"];
  for (const selectId of selectIds) {
    const select = document.getElementById(selectId) as HTMLSelectElement | null;
    if (select) {
      const currentValue = select.value;
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
      createSpeedList(getShortcutSpeeds(), select);
      if (getShortcutSpeeds().includes(currentValue)) {
        select.value = currentValue;
      } else {
        select.value = getShortcutSpeeds()[0]!;
      }
    }
  }
}

function createSettingItem(item: SettingItem): HTMLDivElement {
  let functionDiv = document.createElement("div");
  functionDiv.className = "setting-item";
  let functionValue = gm.getValue(item.enableKey, false);
  let itemCheckBox = document.createElement("input");
  itemCheckBox.type = "checkbox";
  itemCheckBox.checked = Boolean(functionValue);
  itemCheckBox.id = item.classId;
  functionDiv.appendChild(itemCheckBox);
  let itemTextLabel = document.createElement("label");
  itemTextLabel.setAttribute("for", item.classId);
  if (item.recommended) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "★";
    itemTextLabel.appendChild(star);
  }
  const textNode = document.createTextNode(item.text);
  itemTextLabel.appendChild(textNode);
  functionDiv.appendChild(itemTextLabel);
  if (item.valueKey) {
    let select = document.createElement("select");
    select.id = item.valueKey;
    createSpeedList(getShortcutSpeeds(), select);
    select.value = String(gm.getValue(item.valueKey, getDefaultSpeed()));
    functionDiv.appendChild(select);
  }
  return functionDiv;
}

function initializePanel() {
  let panel = document.createElement("div");
  panel.id = "minimalSettingsPanel";
  if (getCurrentLang() === "en") {
    panel.classList.add("lang-en");
  }
  const header = document.createElement("div");
  header.className = "panel-header";
  const title = document.createElement("h2");
  title.textContent = getText("Menu_Settings");
  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  subtitle.textContent = getText("Menu_Subtitle");
  header.appendChild(title);
  header.appendChild(subtitle);
  panel.appendChild(header);

  const shortcutSpeedListSection = document.createElement("div");
  shortcutSpeedListSection.className = "speed-list-section";
  const shortcutInputRow = document.createElement("div");
  shortcutInputRow.className = "input-row";
  const shortcutSpeedListLabel = document.createElement("div");
  shortcutSpeedListLabel.className = "section-label";
  const starSpan = document.createElement("span");
  starSpan.className = "star";
  starSpan.textContent = "★";
  shortcutSpeedListLabel.appendChild(starSpan);
  shortcutSpeedListLabel.appendChild(document.createTextNode(getText("Menu_ShortcutSpeedList_Label")));
  shortcutInputRow.appendChild(shortcutSpeedListLabel);
  const shortcutSpeedListInput = document.createElement("input");
  shortcutSpeedListInput.type = "text";
  shortcutSpeedListInput.id = "shortcutSpeedListInput";
  shortcutSpeedListInput.placeholder = getText("Menu_SpeedList_Placeholder");
  shortcutSpeedListInput.value = String(gm.getValue(shortcutSpeedListKey) ?? getShortcutSpeeds().join(","));
  shortcutInputRow.appendChild(shortcutSpeedListInput);
  shortcutSpeedListSection.appendChild(shortcutInputRow);
  const shortcutSeparatorHint = document.createElement("div");
  shortcutSeparatorHint.className = "separator-hint";
  shortcutSeparatorHint.id = "shortcutSeparatorHint";
  shortcutSeparatorHint.textContent = getText("Menu_SpeedList_Separator");
  shortcutSpeedListSection.appendChild(shortcutSeparatorHint);
  const shortcutErrorMessage = document.createElement("div");
  shortcutErrorMessage.className = "error-message";
  shortcutErrorMessage.id = "shortcutSpeedListError";
  shortcutErrorMessage.textContent = getText("Menu_SpeedList_Error");
  shortcutSpeedListSection.appendChild(shortcutErrorMessage);
  shortcutSpeedListInput.addEventListener("blur", () => {
    const result = validateSpeedList(shortcutSpeedListInput.value, getCurrentLang());
    const errorEl = document.getElementById("shortcutSpeedListError");
    const separatorEl = document.getElementById("shortcutSeparatorHint");
    if (!result.valid) {
      shortcutSpeedListInput.classList.add("error");
      errorEl?.classList.add("show");
      separatorEl?.classList.add("hidden");
    } else {
      shortcutSpeedListInput.classList.remove("error");
      errorEl?.classList.remove("show");
      separatorEl?.classList.remove("hidden");
    }
  });
  shortcutSpeedListInput.addEventListener("input", () => {
    shortcutSpeedListInput.classList.remove("error");
    document.getElementById("shortcutSpeedListError")?.classList.remove("show");
    document.getElementById("shortcutSeparatorHint")?.classList.remove("hidden");
  });
  panel.appendChild(shortcutSpeedListSection);

  const buttonSpeedListSection = document.createElement("div");
  buttonSpeedListSection.className = "speed-list-section";
  const buttonInputRow = document.createElement("div");
  buttonInputRow.className = "input-row";
  const buttonSpeedListLabel = document.createElement("div");
  buttonSpeedListLabel.className = "section-label";
  buttonSpeedListLabel.appendChild(document.createTextNode(getText("Menu_ButtonSpeedList_Label")));
  buttonInputRow.appendChild(buttonSpeedListLabel);
  const buttonSpeedListInput = document.createElement("input");
  buttonSpeedListInput.type = "text";
  buttonSpeedListInput.id = "buttonSpeedListInput";
  buttonSpeedListInput.placeholder = getText("Menu_SpeedList_Placeholder");
  buttonSpeedListInput.value = String(gm.getValue(buttonSpeedListKey) ?? getButtonSpeeds().join(","));
  buttonInputRow.appendChild(buttonSpeedListInput);
  buttonSpeedListSection.appendChild(buttonInputRow);
  const buttonSeparatorHint = document.createElement("div");
  buttonSeparatorHint.className = "separator-hint";
  buttonSeparatorHint.id = "buttonSeparatorHint";
  buttonSeparatorHint.textContent = getText("Menu_SpeedList_Separator");
  buttonSpeedListSection.appendChild(buttonSeparatorHint);
  const buttonErrorMessage = document.createElement("div");
  buttonErrorMessage.className = "error-message";
  buttonErrorMessage.id = "buttonSpeedListError";
  buttonErrorMessage.textContent = getText("Menu_SpeedList_Error");
  buttonSpeedListSection.appendChild(buttonErrorMessage);
  buttonSpeedListInput.addEventListener("blur", () => {
    const result = validateSpeedList(buttonSpeedListInput.value, getCurrentLang());
    const errorEl = document.getElementById("buttonSpeedListError");
    const separatorEl = document.getElementById("buttonSeparatorHint");
    if (!result.valid) {
      buttonSpeedListInput.classList.add("error");
      errorEl?.classList.add("show");
      separatorEl?.classList.add("hidden");
    } else {
      buttonSpeedListInput.classList.remove("error");
      errorEl?.classList.remove("show");
      separatorEl?.classList.remove("hidden");
    }
  });
  buttonSpeedListInput.addEventListener("input", () => {
    buttonSpeedListInput.classList.remove("error");
    document.getElementById("buttonSpeedListError")?.classList.remove("show");
    document.getElementById("buttonSeparatorHint")?.classList.remove("hidden");
  });
  panel.appendChild(buttonSpeedListSection);

  const settingPanelItems = getSettingPanelItems();
  const actionItems: Array<[string, SettingItem]> = [];
  const removeItems: Array<[string, SettingItem]> = [];
  for (const [key, item] of Object.entries(settingPanelItems)) {
    if (key.startsWith("_Action") || key.includes("Action")) {
      actionItems.push([key, item]);
    } else {
      removeItems.push([key, item]);
    }
  }
  if (actionItems.length > 0) {
    const actionsTitle = document.createElement("div");
    actionsTitle.className = "section-title";
    actionsTitle.textContent = getText("Menu_Section_Actions");
    panel.appendChild(actionsTitle);
    const actionsList = document.createElement("div");
    actionsList.className = "setting-list";
    for (const [key, item] of actionItems) {
      actionsList.appendChild(createSettingItem(item));
    }
    panel.appendChild(actionsList);
  }
  if (removeItems.length > 0) {
    const removeTitle = document.createElement("div");
    removeTitle.className = "section-title";
    removeTitle.textContent = getText("Menu_Section_Remove");
    panel.appendChild(removeTitle);
    const removeList = document.createElement("div");
    removeList.className = "setting-list two-columns";
    for (const [key, item] of removeItems) {
      removeList.appendChild(createSettingItem(item));
    }
    panel.appendChild(removeList);
  }

  const shortcutContainer = document.createElement("div");
  shortcutContainer.className = "shortcut-container";
  const shortcutTitle = document.createElement("div");
  shortcutTitle.className = "shortcut-title";
  shortcutTitle.textContent = getText("Menu_Section_Shortcut");
  shortcutContainer.appendChild(shortcutTitle);
  const shortcutDesc = document.createElement("div");
  shortcutDesc.textContent = getText("Menu_Shortcut_Desc");
  shortcutContainer.appendChild(shortcutDesc);
  panel.appendChild(shortcutContainer);

  let buttons = document.createElement("div");
  buttons.className = "buttons";
  let saveBtn = document.createElement("button");
  saveBtn.id = "saveBtn";
  saveBtn.textContent = getText("Menu_Save");
  saveBtn.addEventListener("click", () => saveSettings());
  let closeBtn = document.createElement("button");
  closeBtn.id = "closeBtn";
  closeBtn.textContent = getText("Menu_Close");
  closeBtn.addEventListener("click", () => togglePanel());
  buttons.appendChild(saveBtn);
  buttons.appendChild(closeBtn);
  panel.appendChild(buttons);

  const footer = document.createElement("div");
  footer.className = "panel-footer";
  const authorInfo = document.createElement("div");
  authorInfo.className = "author-info";
  const authorLabel = document.createElement("span");
  authorLabel.className = "author-label";
  authorLabel.textContent = getText("Menu_Author_Title") + ":";
  const authorName = document.createElement("span");
  authorName.className = "author-name";
  authorName.textContent = getText("Menu_Author");
  authorInfo.appendChild(authorLabel);
  authorInfo.appendChild(authorName);
  footer.appendChild(authorInfo);
  const emailInfo = document.createElement("div");
  emailInfo.className = "email-info";
  const emailLabel = document.createElement("span");
  emailLabel.className = "author-label";
  emailLabel.textContent = getText("Menu_Email") + ":";
  const emailLink = document.createElement("a");
  emailLink.href = "mailto:julong@111.com";
  emailLink.textContent = "julong@111.com";
  emailInfo.appendChild(emailLabel);
  emailInfo.appendChild(emailLink);
  footer.appendChild(emailInfo);
  panel.appendChild(footer);

  document.body.appendChild(panel);
  settingPanelElement = panel;
  settingPanelInitialized = true;
}

function saveSettings(): void {
  const shortcutSpeedListInput = document.getElementById("shortcutSpeedListInput") as HTMLInputElement;
  const shortcutErrorMessage = document.getElementById("shortcutSpeedListError") as HTMLElement;
  const shortcutResult = validateSpeedList(shortcutSpeedListInput.value, getCurrentLang());

  const buttonSpeedListInput = document.getElementById("buttonSpeedListInput") as HTMLInputElement;
  const buttonErrorMessage = document.getElementById("buttonSpeedListError") as HTMLElement;
  const buttonResult = validateSpeedList(buttonSpeedListInput.value, getCurrentLang());

  if (!shortcutResult.valid) {
    shortcutSpeedListInput.classList.add("error");
    shortcutErrorMessage.classList.add("show");
    return;
  }
  if (!buttonResult.valid) {
    buttonSpeedListInput.classList.add("error");
    buttonErrorMessage.classList.add("show");
    return;
  }

  shortcutSpeedListInput.classList.remove("error");
  shortcutErrorMessage.classList.remove("show");
  buttonSpeedListInput.classList.remove("error");
  buttonErrorMessage.classList.remove("show");

  gm.setValue(shortcutSpeedListKey, shortcutSpeedListInput.value);
  gm.setValue(buttonSpeedListKey, buttonSpeedListInput.value);

  setSpeedLists(shortcutResult.speeds, buttonResult.speeds);
  updateSpeedSelects(shortcutResult.speeds, buttonResult.speeds, shortcutSpeedListInput.value, buttonSpeedListInput.value);

  const settingPanelItems = getSettingPanelItems();
  for (const [key, item] of Object.entries(settingPanelItems)) {
    const isChecked = (document.getElementById(item.classId) as HTMLInputElement).checked;
    gm.setValue(item.enableKey, isChecked);
    if (item.valueKey) {
      const value = (document.getElementById(item.valueKey) as HTMLSelectElement).value;
      gm.setValue(item.valueKey, value);
    }
  }
  settingPanelElement?.classList.toggle("show");
}

export function togglePanel(): void {
  if (!settingPanelInitialized) {
    initializePanel();
  } else {
    const savedShortcutSpeedList = String(gm.getValue(shortcutSpeedListKey) ?? getShortcutSpeeds().join(","));
    const shortcutResult = validateSpeedList(savedShortcutSpeedList, getCurrentLang());

    const savedButtonSpeedList = String(gm.getValue(buttonSpeedListKey) ?? getButtonSpeeds().join(","));
    const buttonResult = validateSpeedList(savedButtonSpeedList, getCurrentLang());

    if (shortcutResult.valid && buttonResult.valid) {
      updateSpeedSelects(
        shortcutResult.speeds,
        buttonResult.speeds,
        savedShortcutSpeedList,
        savedButtonSpeedList
      );
    }
  }
  settingPanelElement?.classList.toggle("show");
}

export function resetSettingsPanel(): void {
  if (settingPanelElement?.parentNode) {
    settingPanelElement.parentNode.removeChild(settingPanelElement)
  }
  settingPanelElement = null
  settingPanelInitialized = false
}
