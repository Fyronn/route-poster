using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblSeferler
{
    public int SeferId { get; set; }

    public int? RotaId { get; set; }

    public DateOnly SeferTarihi { get; set; }

    public DateTime? BaslamaZamani { get; set; }

    public DateTime? BitisZamani { get; set; }

    public string? Statu { get; set; }

    public virtual TblRotalar? Rota { get; set; }

    public virtual ICollection<TblAracKonumlari> TblAracKonumlaris { get; set; } = new List<TblAracKonumlari>();

    public virtual ICollection<TblSeferAtamalari> TblSeferAtamalaris { get; set; } = new List<TblSeferAtamalari>();

    public virtual ICollection<TblSeferYoklama> TblSeferYoklamas { get; set; } = new List<TblSeferYoklama>();
}
