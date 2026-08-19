import { gm, type GmApi } from '../core/gm-api.js';
import { t } from '../core/i18n.js';
import { shortcutSpeedListKey, buttonSpeedListKey, turboPlaybackEnabledKey, turboPlaybackKeyKey, turboPlaybackSpeedKey, DEFAULT_TURBO_PLAYBACK_KEY, DEFAULT_TURBO_PLAYBACK_SPEED } from '../settings/speed-list-constants.js';
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

function createTurboSpeedList(select: HTMLSelectElement): void {
  const turboSpeeds = getShortcutSpeeds().filter((s) => parseFloat(s) > 1);
  turboSpeeds.forEach((speed) => {
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
  if (item.type === "radio" && item.radioOptions && item.radioName) {
    return createRadioGroup(item);
  }
  if (item.type === "display-mode") {
    return createDisplayModeItem(item);
  }
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

function createRadioGroup(item: SettingItem): HTMLDivElement {
  const groupDiv = document.createElement("div");
  groupDiv.className = "setting-item radio-group";
  const currentValue = gm.getValue(item.enableKey, "web-fullscreen");

  if (item.recommended) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "★";
    groupDiv.appendChild(star);
  }
  const label = document.createElement("label");
  label.textContent = item.text;
  groupDiv.appendChild(label);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "radio-options";
  optionsContainer.style.display = "flex";
  optionsContainer.style.gap = "16px";
  optionsContainer.style.flexWrap = "wrap";
  optionsContainer.style.alignItems = "center";
  
  for (const option of item.radioOptions) {
    const optionDiv = document.createElement("div");
    optionDiv.className = "radio-option";
    optionDiv.style.display = "flex";
    optionDiv.style.alignItems = "center";
    optionDiv.style.gap = "6px";
    
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = item.radioName;
    radio.value = option.value;
    radio.id = `${item.classId}_${option.value}`;
    radio.checked = currentValue === option.value;
    optionDiv.appendChild(radio);
    
    const optionLabel = document.createElement("label");
    optionLabel.setAttribute("for", radio.id);
    optionLabel.textContent = option.text;
    optionDiv.appendChild(optionLabel);
    
    optionsContainer.appendChild(optionDiv);
  }
  
  groupDiv.appendChild(optionsContainer);
  return groupDiv;
}

function createDisplayModeItem(item: SettingItem): HTMLDivElement {
  const functionDiv = document.createElement("div");
  functionDiv.className = "setting-item";

  const enabledKey = item.enableKey;
  const typeKey = "Bilibili_DisplayMode_Type";
  const radioName = item.radioName || "bilibiliDisplayMode";
  const radioOptions = item.radioOptions || [];

  const enabled = gm.getValue(enabledKey, false);
  const currentType = gm.getValue(typeKey, "web-fullscreen");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = Boolean(enabled);
  checkbox.id = item.classId;
  functionDiv.appendChild(checkbox);

  const label = document.createElement("label");
  label.setAttribute("for", item.classId);
  if (item.recommended) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "★";
    label.appendChild(star);
  }
  label.appendChild(document.createTextNode(item.text));
  functionDiv.appendChild(label);

  const radioContainer = document.createElement("div");
  radioContainer.style.display = "flex";
  radioContainer.style.gap = "16px";
  radioContainer.style.marginLeft = "auto";
  radioContainer.style.alignItems = "center";

  for (const option of radioOptions) {
    const optionLabel = document.createElement("label");
    optionLabel.style.display = "flex";
    optionLabel.style.alignItems = "center";
    optionLabel.style.gap = "6px";
    optionLabel.style.cursor = "pointer";
    optionLabel.style.fontSize = "15px";
    optionLabel.style.color = "#374151";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = radioName;
    radio.value = option.value;
    radio.checked = currentType === option.value;
    optionLabel.appendChild(radio);
    optionLabel.appendChild(document.createTextNode(option.text));
    radioContainer.appendChild(optionLabel);
  }

  functionDiv.appendChild(radioContainer);
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

  const turboPlaybackSection = document.createElement("div");
  turboPlaybackSection.className = "turbo-playback-section";

  const turboItem = document.createElement("div");
  turboItem.className = "setting-item";

  const turboEnableCheckbox = document.createElement("input");
  turboEnableCheckbox.type = "checkbox";
  turboEnableCheckbox.id = "turboPlaybackEnabledCheckbox";
  turboEnableCheckbox.checked = Boolean(gm.getValue(turboPlaybackEnabledKey, false));
  turboItem.appendChild(turboEnableCheckbox);

  const turboEnableLabel = document.createElement("label");
  turboEnableLabel.setAttribute("for", "turboPlaybackEnabledCheckbox");
  const turboEnableStar = document.createElement("span");
  turboEnableStar.className = "star";
  turboEnableStar.textContent = "★";
  turboEnableLabel.appendChild(turboEnableStar);
  turboEnableLabel.appendChild(document.createTextNode(getText("Turbo_Playback_Enable_Label")));
  turboItem.appendChild(turboEnableLabel);

  const turboKeyInput = document.createElement("input");
  turboKeyInput.type = "text";
  turboKeyInput.id = "turboPlaybackKeyInput";
  turboKeyInput.placeholder = DEFAULT_TURBO_PLAYBACK_KEY;
  turboKeyInput.value = String(gm.getValue(turboPlaybackKeyKey, DEFAULT_TURBO_PLAYBACK_KEY));
  turboKeyInput.readOnly = true;
  turboKeyInput.title = getText("Turbo_Playback_Key_Hint");
  turboKeyInput.className = "turbo-key-input";
  turboItem.appendChild(turboKeyInput);

  const turboSpeedSelect = document.createElement("select");
  turboSpeedSelect.id = "turboPlaybackSpeedSelect";
  createTurboSpeedList(turboSpeedSelect);
  turboSpeedSelect.value = String(gm.getValue(turboPlaybackSpeedKey, DEFAULT_TURBO_PLAYBACK_SPEED));
  turboSpeedSelect.className = "turbo-speed-select";
  turboItem.appendChild(turboSpeedSelect);

  turboPlaybackSection.appendChild(turboItem);
  panel.appendChild(turboPlaybackSection);

  let capturingKey = false
  turboKeyInput.addEventListener("click", () => {
    capturingKey = true
    turboKeyInput.value = getText("Turbo_Playback_PressKey")
    turboKeyInput.classList.add("capturing")
  })
  document.addEventListener("keydown", (e) => {
    if (!capturingKey) return
    e.preventDefault()
    const key = e.key === " " ? "Space" : e.key
    if (key.length === 1 || ["Shift", "Control", "Alt", "Meta", "Space", "Enter", "Escape", "Tab", "Backspace", "Delete"].includes(key)) {
      turboKeyInput.value = key
      capturingKey = false
      turboKeyInput.classList.remove("capturing")
    }
  })

  const settingPanelItems = getSettingPanelItems();
  const actionItems: Array<[string, SettingItem]> = [];
  const removeItems: Array<[string, SettingItem]> = [];
  for (const [key, item] of Object.entries(settingPanelItems)) {
    if (key.startsWith("_Action") || key.includes("Action") || key.includes("DisplayMode")) {
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

  const turboKeyInput = document.getElementById("turboPlaybackKeyInput") as HTMLInputElement;
  const turboSpeedSelect = document.getElementById("turboPlaybackSpeedSelect") as HTMLSelectElement;
  const turboEnableCheckbox = document.getElementById("turboPlaybackEnabledCheckbox") as HTMLInputElement;
  gm.setValue(turboPlaybackKeyKey, turboKeyInput.value || DEFAULT_TURBO_PLAYBACK_KEY);
  gm.setValue(turboPlaybackSpeedKey, turboSpeedSelect.value);
  gm.setValue(turboPlaybackEnabledKey, turboEnableCheckbox.checked);

  setSpeedLists(shortcutResult.speeds, buttonResult.speeds);
  updateSpeedSelects(shortcutResult.speeds, buttonResult.speeds, shortcutSpeedListInput.value, buttonSpeedListInput.value);

  const settingPanelItems = getSettingPanelItems();
  for (const [key, item] of Object.entries(settingPanelItems)) {
    if (item.type === "display-mode" && item.radioName) {
      const selectedRadio = document.querySelector(`input[name="${item.radioName}"]:checked`) as HTMLInputElement;
      if (selectedRadio) {
        gm.setValue("Bilibili_DisplayMode_Type", selectedRadio.value);
      }
      const isChecked = (document.getElementById(item.classId) as HTMLInputElement).checked;
      gm.setValue(item.enableKey, isChecked);
    } else if ((item.type === "radio" || item.type === "radio-inline") && item.radioName) {
      const selectedRadio = document.querySelector(`input[name="${item.radioName}"]:checked`) as HTMLInputElement;
      if (selectedRadio) {
        gm.setValue(item.enableKey, selectedRadio.value);
      }
    } else {
      const isChecked = (document.getElementById(item.classId) as HTMLInputElement).checked;
      gm.setValue(item.enableKey, isChecked);
      if (item.valueKey) {
        const value = (document.getElementById(item.valueKey) as HTMLSelectElement).value;
        gm.setValue(item.valueKey, value);
      }
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

    const turboKeyInput = document.getElementById("turboPlaybackKeyInput") as HTMLInputElement;
    const turboSpeedSelect = document.getElementById("turboPlaybackSpeedSelect") as HTMLSelectElement;
    const turboEnableCheckbox = document.getElementById("turboPlaybackEnabledCheckbox") as HTMLInputElement;
    if (turboKeyInput) {
      turboKeyInput.value = String(gm.getValue(turboPlaybackKeyKey, DEFAULT_TURBO_PLAYBACK_KEY));
    }
    if (turboSpeedSelect) {
      turboSpeedSelect.value = String(gm.getValue(turboPlaybackSpeedKey, DEFAULT_TURBO_PLAYBACK_SPEED));
    }
    if (turboEnableCheckbox) {
      turboEnableCheckbox.checked = Boolean(gm.getValue(turboPlaybackEnabledKey, false));
    }

    const settingPanelItems = getSettingPanelItems();
    for (const [key, item] of Object.entries(settingPanelItems)) {
      if (item.type === "display-mode" && item.radioName) {
        const savedValue = gm.getValue("Bilibili_DisplayMode_Type", "web-fullscreen");
        const selectedRadio = document.querySelector(`input[name="${item.radioName}"][value="${savedValue}"]`) as HTMLInputElement;
        if (selectedRadio) {
          selectedRadio.checked = true;
        }
      } else if ((item.type === "radio" || item.type === "radio-inline") && item.radioName) {
        const savedValue = gm.getValue(item.enableKey, "web-fullscreen");
        const selectedRadio = document.querySelector(`input[name="${item.radioName}"][value="${savedValue}"]`) as HTMLInputElement;
        if (selectedRadio) {
          selectedRadio.checked = true;
        }
      }
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
