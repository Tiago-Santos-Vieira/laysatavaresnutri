# Site da Laysa Tavares, nutricionista (versão premium)

Recriado em 19/11/2026 no estilo do site do Natan Almeida (ver `../referencias-sites/natan-advocacia/REFERENCIA.md`), com a identidade dela: o logo verdadeiro, o verde-sálvia e o verde-oliva do logo levados para um verde-floresta escuro, creme e champanhe.

Site antigo (continua no ar até publicarmos este): https://laysatavaresnutri.vercel.app/

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Página de links (a da bio do Instagram): foto, logo, "Agenda aberta", Agendar no WhatsApp, Site, Bioimpedância, Como chegar (Maps/Waze) |
| `site/index.html` | Site principal |
| `assets/css/site.css` | Visual do site principal (a página de links tem o CSS dentro dela) |
| `assets/js/site.js` | Abertura, rolagem suave, animações, menu e formulário que abre o WhatsApp |
| `assets/vendor/` | GSAP 3.13 (ScrollTrigger, SplitText) e Lenis 1.3.4, copiados para o projeto |
| `assets/img/` | Recortes da foto dela em WebP, o logo em 3 versões, a imagem de compartilhamento e o ícone |
| `assets/originais/` | Logo, foto e HTML do site antigo, como vieram |

Seções do site principal:
1. Abertura com o monograma LT.
2. Topo: o retrato no arco e o logo com o "Nutricionista" se escrevendo.
3. O que eu acredito: as palavras acendem com a rolagem.
4. Método: anda para o lado no computador.
5. Atendimentos.
6. Bioimpedância: o anel se desenha.
7. Como funciona: a linha liga as 4 etapas.
8. Sobre.
9. Depoimentos: escondido até ter depoimentos reais.
10. Visite o consultório: o círculo cresce.
11. Vamos conversar? (formulário → WhatsApp + mapa).
12. Rodapé.

## Ver no computador

No Claude Code: servidor `laysa-site` (porta 4400) do `.claude/launch.json` da Área de Trabalho. Ou, nesta pasta:

```
python -m http.server 4400
```

e abrir http://localhost:4400 (links) e http://localhost:4400/site/ (site).

## Falta da Laysa (antes de publicar)

- [ ] **Número do CRN.** O Código de Ética do nutricionista pede nome + CRN em toda divulgação. Já existem 3 lugares prontos (`data-crn`, hoje escondidos): rodapé do site, seção Sobre e rodapé da página de links.
- [ ] **Formação e especializações** para a seção Sobre (`.sobre_form`, escondida).
- [ ] **Depoimentos reais**, com autorização. Os do site antigo eram inventados (nomes genéricos e fotos de banco de imagem) e ficaram de fora. Melhor ainda: prints de avaliações do Google ou mensagens com o nome autorizado. Nada de promessa de resultado ("perdi 10 kg").
- [ ] Confirmar se as **4 etapas** (Escuta → Avaliação → Plano → Acompanhamento) batem com o jeito dela de atender.
- [ ] Confirmar se "**Agenda aberta**" continua valendo (está no topo e na página de links).
- [ ] Mais fotos dela (consultório, atendendo, a bioimpedância). Hoje o site usa recortes da mesma foto.
- [ ] Foto da fachada do consultório, para a janela "Como chegar" (como no site do Natan).
- [ ] Se ela anuncia: o ID do **Pixel da Meta**. O código já conta todo clique para o WhatsApp como "Contact".

## Cenas para gerar no Nano Banana (opcional, deixa o topo igual ao do Natan)

O site já funciona sem elas, com fundo verde e luzes. Com as cenas, o topo ganha um ambiente atrás do retrato e o botão **Manhã / Noite**.

Salvar em `assets/img/cenas/` com estes nomes (qualquer formato; eu converto para WebP e ligo o `data-ligada`):

**1. `topo-dia` (16:9, horizontal)**
> Fotografia realista de um consultório de nutrição premium e acolhedor. Paredes verde-floresta profundo, madeira natural clara, mesa de mármore creme com uma fruteira de cerâmica, ramos de eucalipto num vaso, duas poltronas de linho bege, prateleiras com livros e plantas. Luz da manhã entrando por uma grande janela em arco no centro, suave e dourada. Composição simétrica com o centro livre e mais escuro na parte de baixo. Sem pessoas, sem texto, sem logotipos. Lente 35 mm, profundidade de campo rasa, tons de sálvia, creme e dourado.

**2. `topo-noite` (16:9, mesma cena)**: mandar a imagem 1 como referência.
> Transforme esta cena em noite mantendo exatamente o mesmo enquadramento e os mesmos móveis: janela escura azul-petróleo, luminárias de latão e um abajur acesos com luz quente âmbar, sombras profundas, clima aconchegante.

**3. `links-celular` (9:16, vertical)**: referência na imagem 2.
> Versão vertical 9:16 desta mesma cena noturna, com as luminárias acesas na parte de cima, o centro livre e a parte de baixo bem escura.

**4. `links-computador` (16:9)**: pode ser a própria `topo-noite`.

## Publicar

No ar desde 19/11/2026 em https://laysatavaresnutri.vercel.app/ (links) e https://laysatavaresnutri.vercel.app/site/.

- Repositório: `github.com/Tiago-Santos-Vieira/laysatavaresnutri`, ramo `main`. A Vercel publica sozinha a cada envio.
- O site antigo ficou guardado no ramo `site-antigo` do mesmo repositório.
- Esta pasta não é o repositório: para atualizar, copiar `index.html`, `README.md`, `site/` e `assets/` (menos `assets/originais/`) para um clone do repositório e enviar.
