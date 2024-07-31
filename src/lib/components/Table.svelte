<script>
    export let headers = [];
    export let rows = [];
    export let highlight_first_row = false;
  </script>
  
  <table>
    <thead>
      <tr>
        {#each headers as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each row as cell, i}
            <td class:ref-col={highlight_first_row && i == 0}>
                {#each cell.split('\n') as line}
                    <div>{line}</div>
                {/each}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    .ref-col {
        background-color: var(--background-color-second);
    }
    th {
      background-color: var(--background-color-second);
      text-align: left;
    }
    th:first-child {
      background-color: var(--background-color-second); /* Add your highlight color here */
      font-weight: bold;
    }
  </style>
  