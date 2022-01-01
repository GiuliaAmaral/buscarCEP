import { useState } from 'react';
import logo from './search.svg';

function App() {

  const [respostaAPI, setRespostaAPI] = useState({});
  const [mensagem, setMensagem] = useState(null);


  async function buscarCep(e) {
    const value = e.target.value;
    await setMensagem(null);
    await setRespostaAPI(null);

    if (value.length >= 8) {
      await setMensagem({
        texto: 'Carregando...',
        cor: 'bg-primary'
      });

      try {

        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${value}`);
        if (response.ok) {
          const data = await response.json();
          await setRespostaAPI(data);
          await setMensagem(null);
        } else {
          throw new Error(response);
        }

      } catch (error) {

        console.error(error);
        await setRespostaAPI(null);
        await setMensagem({
          texto: 'CEP não encontrado, tente novamente',
          cor: 'bg-danger'
        });

      }
    }

  }

  function impimirPDF() {

    var mywindow = window.open('', 'PRINT');
    mywindow.document.write(`
    <html>
    
    <body>
    <h1>Cep: ${respostaAPI?.cep}</h1>
    <h1>Endereço: ${respostaAPI?.street}</h1>
    <h1>Bairro: ${respostaAPI?.neighborhood}</h1>
    <h1>Cidade: ${respostaAPI?.city}</h1>
    <h1>Estado: ${respostaAPI?.state}</h1>
    </body>
    
    </html>
    
    `
    );
    mywindow.focus();
    mywindow.print();

    setTimeout(() => {
      mywindow.document.close();
      mywindow.close();
    }, 500);
    return true;

  }


  return (<>

    <div className="App">

      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="" width="30" height="24" className="d-inline-block align-text-top" />
            Buscador de CEP
          </a>
        </div>
      </nav>

      <br />

      <section className="container" id='print'>
        <div className="mb-3">
          <label for="cep" className="form-label">Coloque aqui o CEP</label>
          <input maxLength="8" type="text" className="form-control" id="cep" onChange={(e) => buscarCep(e)} />
          <div id="cep" className="form-text">Busque CEP em todo território nacional</div>
        </div>


      </section>


      {
        (respostaAPI?.cep === undefined) ? (<></>) : (<>

          <section className="container text-center" style={{ background: "whitesmoke" }}>
            <p>Cep: {respostaAPI?.cep}</p>
            <p>Endereço: {respostaAPI?.street}</p>
            <p>Bairro: {respostaAPI?.neighborhood}</p>
            <p>Cidade: {respostaAPI?.city}</p>
            <p>Estado: {respostaAPI?.state}</p>
          </section>


          <div className=" container d-grid gap-2 col-6 mx-auto">
            <button onClick={impimirPDF} className="btn btn-primary" type="button">Imprimir</button>
          </div>

        </>)
      }




    </div>



    {
      (mensagem === null) ? (<></>) : (<>

        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: "11" }}>
          <div className={"toast show align-items-center text-white bg-primary border-0 " + mensagem?.cor} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                {mensagem?.texto}
              </div>
              <button onClick={() => { setMensagem(null) }} type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>



      </>)

    }

  </>

  );
}

export default App;
