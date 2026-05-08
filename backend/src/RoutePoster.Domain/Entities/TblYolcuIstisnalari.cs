using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblYolcuIstisnalari
{
    public int IstisnaId { get; set; }

    public int? YolcuId { get; set; }

    public int? RotaId { get; set; }

    public DateOnly IstisnaTarihi { get; set; }

    public DateTime? BildirimZamani { get; set; }

    public string? Aciklama { get; set; }

    public virtual TblRotalar? Rota { get; set; }

    public virtual TblKullanicilar? Yolcu { get; set; }
}
