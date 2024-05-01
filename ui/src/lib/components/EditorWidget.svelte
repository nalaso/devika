<script>
    import { onDestroy, onMount } from 'svelte';
    import { initializeMonaco, createEditors, disposeEditors, enableTabSwitching } from './MonacoEditor';
    import { socket, fetchProjectFiles } from "$lib/api";
    import { selectedProject, selectedSearchEngine } from "$lib/store";

    let monaco;
    let editors = {};
    let editorContainer;
    let tabContainer;
    let searchEngineList = []

    const reCreateEditor = async (files) => {
        disposeEditors(editors);
        editors = {};
        files.forEach((file) => {
            let editor = createEditors(editorContainer, monaco, file);
            editors = {
                ...editors,
                [file.file]: editor
            };
        });
        enableTabSwitching(editors, tabContainer);
    };

    const patchOrFeature = (files) => {
        files.forEach((file, index) => {
            const editor = editors[file.file];
            if (editor) {
                editor.setValue(file.code);
            }else {
              let editor = createEditors(editorContainer, monaco, file);
                editors = {
                  ...editors,
                  [file.file]: editor
              };
            }
        });
        enableTabSwitching(editors, tabContainer);
    };

    const initializeEditor = async () => {
        monaco = await initializeMonaco();
        const files = await fetchProjectFiles();
        reCreateEditor(files)
    };

    onMount(async () => {
        await initializeEditor()
        socket.on('code', async function (data) {
          if(data.from === 'coder'){
            reCreateEditor(data.files);
          }else{
            patchOrFeature(data.files)
          }
        });
    });

    onDestroy(() => {
        disposeEditors(editors);
    });

    $: if ($selectedProject) {
      initializeEditor()
    }
    
    function selectSearchEngine(searchEngine) {
      $selectedSearchEngine = searchEngine;
      document.getElementById("git-commits-dropdown").classList.add("hidden");
    }

    const dropdowns = [
      { dropdown: "git-commits-dropdown", button: "git-commits-button" },
    ];
    function closeDropdowns(event) {
      dropdowns.forEach(({ dropdown, button }) => {
        const dropdownElement = document.getElementById(dropdown);
        const buttonElement = document.getElementById(button);

        if (
          dropdownElement &&
          buttonElement &&
          !dropdownElement.contains(event.target) &&
          !buttonElement.contains(event.target)
        ) {
          dropdownElement.classList.add("hidden");
        }
      });
    }
    onMount(() => {
      
      (async () => {
        if(serverStatus){
          await fetchInitialData();
        }
      })();

      dropdowns.forEach(({ dropdown, button }) => {
        document.getElementById(button).addEventListener("click", function () {
          const dropdownElement = document.getElementById(dropdown);
          dropdownElement.classList.toggle("hidden");
        });
      });
      document.addEventListener("click", closeDropdowns);
      return () => {
        document.removeEventListener("click", closeDropdowns);
      };
    });
</script>


<div
  class="w-full h-full flex flex-1 flex-col border-[3px] overflow-hidden rounded-xl border-window-outline p-0"
>
  <div class="flex items-center p-2 border-b bg-terminal-window-ribbon">
    <div class="flex ml-2 mr-4 space-x-2">
      <div class="w-3 h-3 rounded-full bg-terminal-window-dots"></div>
      <div class="w-3 h-3 rounded-full bg-terminal-window-dots"></div>
      <div class="w-3 h-3 rounded-full bg-terminal-window-dots"></div>
    </div>
      <div class="flex text-tertiary text-sm overflow-x-auto" bind:this={tabContainer} />
      {#if Object.keys(editors).length == 0}
        <div class="flex items-center text-tertiary text-sm">Code viewer</div>
      {/if}
      <div class="relative inline-block text-left">
        <div>
          <button
            type="button"
            class="inline-flex items-center justify-between min-w-[200px] text-foreground w-fit gap-2 px-3 text-sm h-9 bg-secondary rounded-md"
            id="git-commits-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <span id="selected-search-engine">{$selectedSearchEngine}</span>
            <i class="fas fa-angle-down text-tertiary"></i>
          </button>
        </div>
  
        <div
          id="git-commits-dropdown"
          class="absolute left-0 z-10 mt-2 origin-top-right min-w-[200px] bg-secondary rounded-xl shadow-lg max-h-96 overflow-y-auto hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="git-commits-button"
          tabindex="-1"
        >
          <div role="none" class="flex flex-col divide-y-2 w-full">
            <!-- {#if $searchEngineList !== null}
              {#each $searchEngineList as engine}
                <div
                  class="flex items-center px-4 hover:bg-black/20 transition-colors
              {selectSearchEngine === engine ? 'bg-gray-300' : ''}"
                >
                  <button
                    class="flex gap-2 items-center text-sm py-3 w-full text-clip"
                    on:click|preventDefault={() => selectSearchEngine(engine)}
                  >
                    {engine}
                  </button>
                </div>
              {/each}
            {/if} -->
          </div>
        </div>
      </div>
  </div>
  <div
    class="h-full rounded-bl-lg bg-terminal-window-background p-0" bind:this={editorContainer}
  ></div>
</div>